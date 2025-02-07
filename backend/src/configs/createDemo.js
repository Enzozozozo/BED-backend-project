const bcrypt = require('bcrypt');
const pool = require('../services/db');
const saltRounds = 10;

const addAdminUser = async () => {
    try {
        // Check if an admin already exists
        const checkAdminSQL = `SELECT COUNT(*) AS count FROM User WHERE username = 'admin'`;
        pool.query(checkAdminSQL, async (err, results) => {
            if (err) {
                console.error("Error checking admin user:", err);
                return;
            }

            const adminCount = results[0].count;
            if (adminCount > 0) {
                console.log("Admin user already exists. Skipping creation.");
                return;
            }

            // If no admin exists, create one
            const hashedPassword = await bcrypt.hash('admin', saltRounds); // Hash password
            const insertAdminSQL = `INSERT INTO User (username, email, password, skillpoints) VALUES (?, ?, ?, ?)`;

            // Insert the admin user
            pool.query(insertAdminSQL, ['admin', 'a@a', hashedPassword, 9999], (insertErr, result) => {
                if (insertErr) {
                    console.error("Error inserting admin user:", insertErr);
                } else {
                    console.log("Admin user inserted successfully!");
                    const adminId = result.insertId; // Get the ID of the inserted admin user

                    // Now insert into Inventory directly (no need to insert into Monkey table)
                    const insertInventorySQL = `
                    INSERT INTO Inventory (user_id, monkey_id, monkeyUpgrade) 
                    VALUES 
                        (?, 1, '000'),
                        (?, 2, '000'),
                        (?, 3, '000'),
                        (?, 4, '000'),
                        (?, 5, '000'),
                        (?, 6, '200'),
                        (?, 7, '020'),
                        (?, 8, '002');

                `;
                pool.query(insertInventorySQL, [adminId, adminId, adminId, adminId, adminId, adminId, adminId, adminId], (err, result) => {
                    if (err) {
                        console.error("Error inserting into Inventory:", err);
                    } else {
                        console.log("Inserted into Inventory successfully.");
                    }
                });
                }
            });
        });
    } catch (err) {
        console.error("Error hashing password:", err);
    }
};

module.exports = addAdminUser;
