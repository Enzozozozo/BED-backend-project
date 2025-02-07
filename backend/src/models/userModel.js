const pool = require('../services/db');

// module.exports.retrieveAllUsers = (callback) =>
// {
//     const SQLSTATMENT = `
//     SELECT id, username, email, created_on, updated_on, last_login_on FROM USER
//     `;

// pool.query(SQLSTATMENT, callback);
// }
    


// module.exports.deleteByID = (data, callback) =>
//     {
//         const SQLSTATMENT = `
//         DELETE FROM User 
//         WHERE id = ?;
//         `;
//     const VALUES = [data.id];
    
//     pool.query(SQLSTATMENT, VALUES, callback);
//     }



module.exports.checkUser = (data, callback) => {
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ? OR email = ?
    `;
    const VALUES = [data.username, data.email]
    pool.query(SQLSTATMENT, VALUES, callback)
}
    

module.exports.findUserByUsername = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User 
        WHERE username = ?;
    `;
    const VALUES = [data.username];
    pool.query(SQLSTATEMENT, VALUES, callback); 
};



module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
    UPDATE User
    SET skillpoints = ?
    WHERE user_id = ?;
    `;
const VALUES = [data.skillpoints, data.userId];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectUserByID = (userId, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, skillpoints
        FROM User
        WHERE user_id = ?;
    `;
    const VALUES = [userId];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.getUserByUsername = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM User
        WHERE username = ?;  
    `;
    const VALUES = [data.username]; 

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO User (username, email, password)
        VALUES (?, ?, ?)
        `;
    const VALUES = [data.username, data.email, data.password];
    pool.query(SQLSTATMENT, VALUES, callback);
}
