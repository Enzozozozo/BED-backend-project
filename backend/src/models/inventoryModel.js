const pool = require('../services/db');

module.exports.readInventorybyId = (userId, callback) => {
    const SQLSTATEMENT = `
        SELECT i.inventory_id, i.monkey_id, m.monkeyName, i.monkeyType, i.monkeyPrice, i.monkeyUpgrade
        FROM Inventory i
        JOIN Monkey m ON i.monkey_id = m.monkey_id
        WHERE i.user_id = ?;
    `;
    const VALUES = [userId];

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return callback(error, null);  // Pass error to the callback
        }
        return callback(null, results);  // Pass results to the callback
    });
};
module.exports.readInventorybyIdMiddleware = (userId, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM INVENTORY
        WHERE user_id = ?
    `;
    const VALUES = [userId];

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return callback(error, null);  // Pass error to the callback
        }
        return callback(null, results);  // Pass results to the callback
    });
};

// View a specific monkey's statistics by ID
module.exports.readMonkeyById = (monkeyId, callback) => {
    const SQLSTATEMENT = `
        SELECT monkey_id, monkeyName, monkeyType, monkeyUpgrade, monkeyPrice, upgradeTier1Price, upgradeTier2Price
        FROM Monkey
        WHERE monkey_id = ?; 
    `;
    const VALUES = [monkeyId]; 
    pool.query(SQLSTATEMENT, VALUES, callback); 
};


module.exports.addMonkeyToInventory = (userId, monkeyId, monkeyType, monkeyPrice, monkeyUpgrade, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Inventory (user_id, monkey_id, monkeyType, monkeyPrice, monkeyUpgrade)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [userId, monkeyId, monkeyType, monkeyPrice, monkeyUpgrade];

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
};



module.exports.removeMonkeyFromInventory = (userId, monkeyId, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Inventory 
        WHERE user_id = ? AND monkey_id = ?;
    `;
    const VALUES = [userId, monkeyId];

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
};

