const pool = require('../services/db');

module.exports.getUserSkillPoints = (userId, callback) => {
    const SQLSTATEMENT = `
        SELECT skillpoints
        FROM User
        WHERE user_id = ?; 
    `;
    const VALUES = [userId]; 
    pool.query(SQLSTATEMENT, VALUES, callback); 
};

module.exports.deductSkillpoints = (userId, skillPointsToDeduct, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillPoints = skillPoints - ?
        WHERE user_id = ?;
    `;
    const VALUES = [skillPointsToDeduct, userId];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deductSkillpointsUpgrade = (userId, upgradePrice, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillPoints = skillPoints - ?
        WHERE user_id = ?;
    `;
    const VALUES = [upgradePrice, userId];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Model to update the monkey upgrade by inventory_id
module.exports.updateMonkeyUpgradeByInventoryId = (monkeyId, newMonkeyUpgrade, callback) => {
    const GET_LATEST_INVENTORY_ID = `
        SELECT inventory_id FROM Inventory
        WHERE monkey_id = ?
        ORDER BY inventory_id DESC
        LIMIT 1;
    `;

    pool.query(GET_LATEST_INVENTORY_ID, [monkeyId], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, { message: "No inventory found for this monkey ID." });
        }

        const latestInventoryId = results[0].inventory_id;

        const UPDATE_STATEMENT = `
            UPDATE Inventory
            SET monkeyUpgrade = ?
            WHERE inventory_id = ?;
        `;

        pool.query(UPDATE_STATEMENT, [newMonkeyUpgrade, latestInventoryId], (updateError, updateResults) => {
            if (updateError) {
                return callback(updateError, null);
            }

            return callback(null, updateResults);
        });
    });
};


// module.exports.updateMonkeyUpgrade = (monkeyId, newMonkeyUpgrade, callback) => {
//     const SQLSTATEMENT = `
//         UPDATE Monkey m
//         JOIN Inventory i ON m.monkey_id = i.monkey_id
//         SET m.monkeyUpgrade = ?, i.monkeyUpgrade = ?
//         WHERE m.monkey_id = ?;
//     `;
//     const VALUES = [newMonkeyUpgrade, newMonkeyUpgrade, monkeyId];

//     pool.query(SQLSTATEMENT, VALUES, (error, results) => {
//         if (error) {
//             console.error("Error updating Monkey and Inventory upgrades:", error);
//             return callback(error, null);
//         }
//         callback(null, results);
//     });
// };





