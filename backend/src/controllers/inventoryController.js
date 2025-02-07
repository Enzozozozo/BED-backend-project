const model = require("../models/inventoryModel.js");

// Display all Inventory
module.exports.readInventorybyId = (req, res, next) => {
    const userId = res.locals.userId;

    // Retrieve the inventory for the given user
    model.readInventorybyId(userId, (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No inventory found for this user, no equippable items equipped." });
        }

        const inventoryData = result.map(item => ({
            inventory_id: item.inventory_id,
            monkeyId: item.monkey_id, 
            monkeyName: item.monkeyName,  
            monkeyUpgrade: item.monkeyUpgrade  
        }));

        res.locals.inventory = inventoryData;

        res.status(200).json({ inventory: inventoryData });
    });
};


// Display all Inventory
module.exports.readInventorybyIdMiddleware = (req, res, next) => {
    const userId = res.locals.userId;

    // Retrieve the inventory for the given user
    model.readInventorybyIdMiddleware(userId, (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No inventory found for this user, no equippable items equipped." });
        }

        const inventoryData = result.map(item => ({
            inventory_id: item.inventory_id,
            "Monkey Name": item.monkeyName, 
            "Upgrade": item.monkeyUpgrade,
        }));

        // Store the inventory data in res.locals to make it available to subsequent middleware or routes
        res.locals.inventory = inventoryData;

        // Call next() to pass control to the next middleware
        next();
    });
};


// Read a single monkey by its ID
module.exports.readMonkeyByIdMiddleware = (req, res, next) => {
    const monkeyId = req.params.monkeyId;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in readMonkeyById:", error);
            return next(error); 
        } else {
            if (results.length > 0) {
                const formattedResults = results.map(row => ({
                    "Monkey Id": row.monkey_id,
                    "Monkey Name": row.monkeyName,
                    "Type": row.monkeyType,
                    "Upgrade": row.monkeyUpgrade,
                    "Price": row.monkeyPrice,
                    "UpgradeTier1": row.upgradeTier1Price,
                    "UpgradeTier2": row.upgradeTier2Price
                }));

                req.monkeyId = formattedResults[0]["Monkey Id"];
                req.monkeyName = formattedResults[0]["Monkey Name"];
                req.monkeyType = formattedResults[0]["Type"];
                req.monkeyPrice = formattedResults[0]["Price"];
                req.monkeyUpgrade = formattedResults[0]["Upgrade"];
                req.upgradeTier1Price = formattedResults[0]["UpgradeTier1"];
                req.upgradeTier2Price = formattedResults[0]["UpgradeTier2"];
                return next();
            } 
        }
    };

    model.readMonkeyById(monkeyId, callback);
};



module.exports.readMonkeyById = (req, res, next) => {
    const monkeyId = req.params.monkeyId;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in readMonkeyById:", error);
            return res.status(500).json({ message: "Error retrieving monkey data" })
        } else {
            if (results.length > 0) {
                const formattedResults = results.map(row => ({
                    "Monkey Id": row.monkey_id,
                    "Monkey Name": row.monkeyName,
                    "Type": row.monkeyType,
                    "Upgrade": row.monkeyUpgrade,
                    "Price": row.monkeyPrice,
                    "UpgradeTier1": row.upgradeTier1Price,
                    "UpgradeTier2": row.upgradeTier2Price
                }));

                // Attach data to the request object for use in other middleware
                req.monkeyId = formattedResults[0]["Monkey Id"];
                req.monkeyPrice = formattedResults[0]["Price"];
                req.monkeyUpgrade = formattedResults[0]["Upgrade"];
                req.upgradeTier1Price = formattedResults[0]["UpgradeTier1"];
                req.upgradeTier2Price = formattedResults[0]["UpgradeTier2"];
                return res.status(200).json(formattedResults[0]);
            } 
        }
    };
    model.readMonkeyById(monkeyId, callback);
};



module.exports.addMonkey = (req, res, next) => {
    const userId = res.locals.userId;
    const monkeyId = req.monkeyId;
    const monkeyType = req.monkeyType;
    const monkeyPrice = req.monkeyPrice;
    const monkeyUpgrade = req.monkeyUpgrade;

    // Log values before passing to the model
    console.log("User ID:", userId);
    console.log("Monkey ID:", monkeyId);
    console.log("Monkey Type:", monkeyType);
    console.log("Monkey Price:", monkeyPrice);
    console.log("Monkey Upgrade:", monkeyUpgrade);

    model.addMonkeyToInventory(userId, monkeyId, monkeyType, monkeyPrice, monkeyUpgrade, (error, results) => {
        if (error) {
            console.error("Error adding monkey to inventory:", error);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        if (results.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Monkey successfully added to inventory" });
        } else {
            return res.status(400).json({ success: false, message: "Failed to add monkey to inventory" });
        }
    });
};




// Remove a monkey from the user's inventory
module.exports.removeMonkey = (req, res, next) => {
    const userId = res.locals.userId;
    const monkeyId = req.params.monkeyId;

    console.log(userId)
    console.log(monkeyId)

    // Check if userId and monkeyId are provided
    if (!userId || !monkeyId) {
        return res.status(400).json({ error: "userId and monkeyId are required" });
    }

    // Remove the monkey from the inventory
    model.removeMonkeyFromInventory(userId, monkeyId, (error, results) => {
        if (error) {
            // Log error if removing monkey fails
            console.error("Error removing monkey:", error);
            return res.status(500).json({ error: "Database error" });
        }

        // Check if no monkey was found or inventory is empty
        if (results.message === "Inventory is empty / monkey not found") {
            return res.status(400).json({ message: "Inventory is empty / monkey not found" });
        }

        // Return the results after removing the monkey
        return res.status(200).json(results);
    });
};
