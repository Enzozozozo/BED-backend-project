const model = require("../models/upgradeModel.js");


module.exports.deductSkillpoints = (req, res, next) => {
    const userId = res.locals.userId;
    const monkeyPrice = req.monkeyPrice; 
    const monkeyId = req.monkeyId;

    console.log("userid", userId);
    console.log("monkeyPrice", monkeyPrice);
    console.log("monkeyId", monkeyId);

    if (!userId || monkeyPrice === undefined || !monkeyId) {
        console.log("Missing required data (userId, monkeyPrice, or monkeyId).");
        return res.status(400).json({ message: "Missing required data." });
    }

    model.getUserSkillPoints(userId, (error, results) => {
        if (error) {
            console.error("Error fetching user skill points:", error);
            return res.status(500).json({ message: "Error retrieving user skill points." });
        }

        if (results.length === 0) {
            console.log("User not found.");
            return res.status(404).json({ message: "User not found." });
        }

        const userSkillPoints = results[0].skillpoints;
        console.log('User skill points:', userSkillPoints);
        
        const userResultSkillPoints = userSkillPoints - monkeyPrice;
        console.log('Remaining skill points after deduction:', userResultSkillPoints);

        if (userResultSkillPoints < monkeyPrice) {
            console.log("Not enough skill points.");
            return res.status(400).json({ success: false, message: "Not enough skill points." });
        }

        model.deductSkillpoints(userId, monkeyPrice, (updateError, updateResults) => {
            if (updateError) {
                console.error("Error updating skill points:", updateError);
                return res.status(500).json({ message: "Error updating skill points." });
            }

            console.log("Skill points successfully deducted!");

            return res.status(200).json({
                success: true,
                currentSkillPoints: userSkillPoints,
                pointsToDeduct: monkeyPrice,
                remainingSkillPoints: userResultSkillPoints
            });
        });
    });
};

module.exports.deductSkillpointsUpgrade = (req, res, next) => {
    const userId = res.locals.userId;
    const monkeyId = req.body.monkeyId
    const upgradeTier1Price = req.upgradeTier1Price;  // First price deduction
    const upgradeTier2Price = req.upgradeTier2Price;  // Second price deduction
    const btnId = req.params.btnId;  // Button ID for upgrade action
    const upgradeCycles = req.body.upgradeCycles;  // Button ID for upgrade action

    console.log(req.body);
    console.log("userid", userId);
    console.log("upgradeTier1Price", upgradeTier1Price);
    console.log("upgradeTier2Price", upgradeTier2Price);
    console.log("upgradeCycles", upgradeCycles);

    // Ensure that all necessary data is present in the request
    if (!userId || upgradeTier1Price === undefined || upgradeTier2Price === undefined || !upgradeCycles || upgradeCycles.length === 0) {
        console.log("Missing required data (userId, upgradeTier1Price, upgradeTier2Price, inventoryId, or upgradeCycles).");
        return res.status(400).json({ message: "Missing required data." });
    }

    // Fetch user skill points
    model.getUserSkillPoints(userId, (error, results) => {
        if (error) {
            console.error("Error fetching user skill points:", error);
            return res.status(500).json({ message: "Error retrieving user skill points." });
        }

        if (results.length === 0) {
            console.log("User not found.");
            return res.status(404).json({ message: "User not found." });
        }

        const userSkillPoints = results[0].skillpoints;
        console.log('User skill points:', userSkillPoints);

        let upgradePrice = 0;

        // Calculate the total deduction based on upgradeCycles
        for (let i = 0; i < upgradeCycles.length; i++) {
            if (upgradeCycles[i] === 1) {
                upgradePrice += upgradeTier1Price;  // First click deduction
            } else if (upgradeCycles[i] === 2) {
                upgradePrice += upgradeTier2Price;  // Second click deduction
            }
        }

        const userResultSkillPoints = userSkillPoints - upgradePrice;
        console.log('Remaining skill points after deduction:', userResultSkillPoints);

        if (userResultSkillPoints < 0) {
            console.log("Not enough skill points.");
            return res.status(400).json({ success: false, message: "Not enough skill points." });
        }

        // Deduct skill points
        model.deductSkillpointsUpgrade(userId, upgradePrice, (updateError, updateResults) => {
            if (updateError) {
                console.error("Error updating skill points:", updateError);
                return res.status(500).json({ message: "Error updating skill points." });
            }

            console.log("Skill points successfully deducted!");

            // Determine new monkey upgrade based on the upgrade cycle and button clicked
            let newMonkeyUpgrade;

            if (upgradeCycles.includes(1)) {
                switch (btnId) {
                    case '0':
                        newMonkeyUpgrade = '100';
                        break;
                    case '1':
                        newMonkeyUpgrade = '010';
                        break;
                    case '2':
                        newMonkeyUpgrade = '001';
                        break;
                    default:
                        return res.status(400).json({ message: "Invalid button ID for upgrade cycle 1." });
                }
            }

            if (upgradeCycles.includes(2)) {
                switch (btnId) {
                    case '0':
                        newMonkeyUpgrade = '200';
                        break;
                    case '1':
                        newMonkeyUpgrade = '020';
                        break;
                    case '2':
                        newMonkeyUpgrade = '002';
                        break;
                    default:
                        return res.status(400).json({ message: "Invalid button ID for upgrade cycle 2." });
                }
            }

            // Update the monkey upgrade in the Inventory table based on inventory_id
            if (newMonkeyUpgrade) {
                model.updateMonkeyUpgradeByInventoryId(monkeyId, newMonkeyUpgrade, (upgradeError, upgradeResult) => {
                    if (upgradeError) {
                        console.error("Error updating monkey upgrade:", upgradeError);
                        return res.status(500).json({ message: "Error updating monkey upgrade." });
                    }
            
                    if (upgradeResult.message) {
                        return res.status(404).json({ message: "No inventory found for this monkey ID." });
                    }
            
                    console.log(`Monkey upgrade updated in latest inventory for monkey ${monkeyId} to ${newMonkeyUpgrade}`);
            
                    return res.status(200).json({
                        success: true,
                        message: `Monkey upgrade in latest inventory of monkey ${monkeyId} updated successfully.`,
                        newUpgrade: newMonkeyUpgrade,
                        currentSkillPoints: userSkillPoints,
                        pointsToDeduct: upgradePrice,
                        remainingSkillPoints: userResultSkillPoints
                    });
                });
            }else {
                return res.status(400).json({ message: "Invalid upgrade cycle or button ID." });
            }
        });
    });
};

