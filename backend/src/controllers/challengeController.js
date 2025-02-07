const model = require("../models/challengeModel.js");

// Question 4: Create a new challenge
module.exports.createNewChallenge = (req, res, next) => {
    const data = {
        challenge: req.body.challenge,
        user_id: res.locals.userId,
        skillpoints: req.body.skillpoints
    };

    // Validate required fields
    if (!data.challenge || !data.user_id || data.skillpoints === undefined) {
        return res.status(400).send("Error: challenge, user_id, and skillpoints are required");
    }

    const callback = (error, results, fields) => {
        if (error) {
            // Log error and return a 500 status code
            console.error("Error createChallenge:", error);
            return res.status(500).json(error);
        }

        // Return the created challenge details with a 201 status code
        res.status(201).json({
            challenge_id: results.insertId,
            challenge: data.challenge,
            creator_id: data.user_id,
            skillpoints: data.skillpoints
        });
    };

    // Insert the new challenge into the database
    model.insertChallenge(data, callback);
};

// Question 5: Read all challenges
module.exports.readAllChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            // Log error and return a 500 status code
            console.error("Error getAllChallenges:", error);
            return res.status(500).json(error);
        }

        // Return the challenges as JSON
        res.status(200).json(results);
    };

    // Fetch all challenges from the database
    model.readChallenges(callback);
};

// Question 6: Update a challenge by its ID
module.exports.updateChallengeById = (req, res, next) => {
    const data = {
        userId: res.locals.userId,
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints,
        challenge_id: req.params.challengeId
    };

    // Validate required fields
    if (!data.userId || !data.challenge || data.skillpoints === undefined) {
        console.log(data.userId)
        console.log(data.challenge)
        console.log(data.skillpoints)
        return res.status(400).json({
            message: "Error: userId, challenge, and skillpoints are required"
        });
    }

    // Check if the user is the creator of the challenge
    const checkCreatorCallback = (error, results, fields) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            console.log("Results:", results); 
            return res.status(404).json({
                message: "Error: Challenge not found"
            });
        }

        if (results[0].creator_id !== data.userId) {
            return res.status(403).json({
                message: "Error: You are not the creator of this challenge"
            });
        }

        // Update challenge if the user is the creator
        const updateCallback = (updateError, updateResults, updateFields) => {
            if (updateError) {
                console.error("Update error:", updateError);
                return res.status(500).json(updateError);
            }

            if (updateResults.affectedRows === 0) {
                return res.status(404).json({
                    message: "Error: Challenge not found"
                });
            }

            // Return updated challenge details
            return res.status(200).json({
                challenge_id: data.challenge_id,
                challenge: data.challenge,
                creator_id: data.userId,
                skillpoints: data.skillpoints
            });
        };

        // Prepare data for the update operation
        const updateData = { challenge: data.challenge, skillpoints: data.skillpoints, challenge_id: data.challenge_id };
        model.updateById(updateData, updateCallback);
    };

    // Check if the user is the creator of the challenge
    model.getChallengeCreatorById(data, checkCreatorCallback);
};

// Question 7: Delete a challenge by its ID
module.exports.deleteChallengeById = (req, res, next) => {
    const data = {
        id: req.params.challenge_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteChallengeById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Challenge not found"
            });
        }

        // Proceed to delete associated user completions
        model.deleteUserCompletions(data.id, deleteCompletionsCallback);
    };

    // Callback for deleting user completions
    const deleteCompletionsCallback = (completionsError, completionsResults) => {
        if (completionsError) {
            console.error("Error deleting completions:", completionsError);
            return res.status(500).json(completionsError);
        }

        // Return success message after challenge and completions deletion
        return res.status(200).json({
            message: "Challenge and user completions successfully deleted"
        });
    };

    // Initiate deletion of the challenge
    model.deleteChallengeById(data, callback);
};

// Question 8: Create a completion for a challenge
module.exports.createCompletionForChallenge = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        userId: res.locals.userId,
        completed: req.body.completed,
        notes: req.body.notes
    };

    console.log("Received Data:", data);

    if (!data.userId) {
        return res.status(400).json({ message: "Error: userId is required" });
    }

    // Check if the challenge exists
    model.getChallengeById({ challenge_id: data.challenge_id }, (error, challengeResults) => {
        if (error) return res.status(500).json({ message: "Internal server error" });

        if (challengeResults.length === 0) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Check if the user exists
        model.getUserById({ userId: data.userId }, (userError, userResults) => {
            if (userError) {
                console.error("Error fetching user:", userError);
                return res.status(500).json({ message: userError });
            }
        
            console.log("User query result:", userResults); // Debug log
        
            if (userResults.length === 0) {
                console.error("User not found in database:", data.userId);
                return res.status(404).json({ message: "User not found" });
            }

            // Award skillpoints based on completion status
            const skillpointsAwarded = data.completed ? challengeResults[0].skillpoints : 5;

            // Insert completion record
            const completionData = {
                challenge_id: data.challenge_id,
                userId: data.userId,
                completed: data.completed,
                notes: data.notes,
                skillpoints: skillpointsAwarded
            };

            model.createCompletionRecord(completionData, (insertError, insertResults) => {
                if (insertError)
                return res.status(500).json({ message: insertError });

                res.status(201).json({
                    complete_id: insertResults.insertId,
                    ...completionData
                });
            });
        });
    });
};


// Question 9: Get participants by challenge ID
module.exports.getParticipantsByChallengeId = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error fetching participants:", error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No participants for this challenge_id" });
        }

        // Return the participants for the given challenge
        res.status(200).json(results);
    };

    // Fetch participants for the specified challenge_id
    model.getParticipantsByChallengeId(data, callback);
};
