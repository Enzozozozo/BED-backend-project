const pool = require('../services/db');

// Question 4: Insert a new challenge into the FitnessChallenge table
module.exports.insertChallenge = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO FitnessChallenge (challenge, creator_id, skillpoints)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.challenge, data.user_id, data.skillpoints];
    pool.query(SQLSTATEMENT, VALUES, callback);  // Executes the SQL query
};

// Question 5: Read all challenges from the FitnessChallenge table
module.exports.readChallenges = (callback) => {
    const SQLSTATEMENT = `
        SELECT challenge_id, challenge, creator_id, skillpoints
        FROM FitnessChallenge;
    `;
    pool.query(SQLSTATEMENT, callback);  // Executes the SQL query to fetch all challenges
};

// Question 6: Update an existing challenge by its ID
module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE FitnessChallenge
        SET challenge = ?, skillpoints = ?
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge, data.skillpoints, data.challenge_id];
    pool.query(SQLSTATMENT, VALUES, callback);  // Executes the SQL query to update the challenge
};

// Question 6: Get the creator of a specific challenge by its ID
module.exports.getChallengeCreatorById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FitnessChallenge
        WHERE challenge_id = ? AND creator_id = ?;
    `;
    const VALUES = [data.challenge_id, data.userId];

    console.log('Executing query with values:', VALUES);

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            console.error('Query Error:', error);
            return callback(error, null);
        }

        console.log('Query Results:', results);

        // Pass results to callback
        callback(null, results);
    });
};


// Question 7: Delete a challenge by its ID
module.exports.deleteChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);  // Executes the SQL query to delete the challenge
};

// Question 7: Delete user completions associated with a specific challenge
module.exports.deleteUserCompletions = (challengeId, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM UserCompletion
        WHERE challenge_id = ?;
    `;
    const VALUES = [challengeId];
    pool.query(SQLSTATEMENT, VALUES, callback);  // Executes the SQL query to delete user completions
};

// Question 8: Get user details by user ID
module.exports.getUserById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
    `;
    const VALUES = [data.userId];
    pool.query(SQLSTATEMENT, VALUES, callback); 
};

// Question 8: Get challenge details by challenge ID
module.exports.getChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Question 8: Create a completion record for a challenge
module.exports.createCompletionRecord = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes, skillpoints)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.userId, data.completed, data.creation_date, data.notes, data.skillpoints];
    pool.query(SQLSTATEMENT, VALUES, callback);  // Executes the SQL query to insert a completion record
};

// Question 9: Get participants of a challenge by its ID
module.exports.getParticipantsByChallengeId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, completed, creation_date, notes
        FROM UserCompletion
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id]; 
    pool.query(SQLSTATEMENT, VALUES, callback);  // Executes the SQL query to fetch participants
};
