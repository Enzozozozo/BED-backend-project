const model = require("../models/userModel");

module.exports.checkUsernameOrEmailExist = (req, res, next) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
    };

    model.checkUser(data, (error, results) => {
        if (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        // If a record exists, that means the username or email is taken
        if (results.length > 0) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        // Proceed to the next middleware if no conflict
        next();
    });
};


module.exports.register = (req, res, next) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash, 
    };

    const insertCallback = (error, results) => {
        if (error) {
            console.error("Error in insertSingle:", error);
            return res.status(500).json({ error: "Database error during user creation." });
        }
        else{
            if(results.affectedRows == 0){
                res.status(200).json({
                    message: `User ${data.username} could not be created`,
                });
            }
            else{
                next()
            }
        }
    };
    model.insertSingle(data, insertCallback);
};


module.exports.login = (req, res, next) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    // Validate input
    if (!data.username || !data.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Assuming you have a method `findUserByUsername` that queries the user by username from the database
    model.findUserByUsername(data, (error, results) => {
        if (error) {
            console.error("Error querying user:", error); // Log the error for debugging
            return res.status(500).json({ message: "Database error during login." });
        }

        if (results.length === 0) {
            console.log(`User with username ${data.username} not found.`); // Log if user not found
            return res.status(404).json({ message: "User not found" });
        }

        // Extract user data
        const user = results[0];

        // Store user data in res.locals for later use
        res.locals.user = user; 
        res.locals.user_id = user.user_id; // Ensure user_id is stored
        res.locals.hash = user.password; // Store the hashed password to compare later

        // Debug logs
        console.log("User Data Retrieved:", user);
        console.log("Stored user_id in res.locals:", res.locals.user_id);
        console.log("Stored hash in res.locals:", res.locals.hash);

        // Proceed to the next middleware (compare password)
        next();
    });
};

module.exports.readSkillpointsbyId = (req, res, next) => {
    const userId = res.locals.userId; 

    const callback = (error, results, fields) => {
    console.log(results)
        if (error) {
            console.error("Error readUserByID:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }
    model.selectUserByID(userId, callback);
}

module.exports.updateUserById = (req, res, next) => {
    const userId = res.locals.userId;
    const additionalSkillPoints = parseInt(req.body.skillpoints, 10); // Ensure it's a number

    if (!userId) {
        return res.status(404).send("Error: user_id does not exist");
    }

    console.log(`Updating skill points for user ${userId}, adding ${additionalSkillPoints}`);

    // Fetch the current user details
    model.selectUserByID({ user_id: userId }, (error, results) => {
        if (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).send("Error: User not found");
        }

        console.log("User found:", results[0]);

        const currentSkillPoints = parseInt(results[0].skillpoints, 10) || 0; // Default to 0
        const updatedSkillPoints = currentSkillPoints + additionalSkillPoints; // Add new points

        console.log(`Current skill points: ${currentSkillPoints}, Updated skill points: ${updatedSkillPoints}`);

        // Update user skill points
        model.updateById({ userId, skillpoints: updatedSkillPoints }, (updateError, updateResults) => {
            if (updateError) {
                console.error("Error updating user:", updateError);
                return res.status(500).json(updateError);
            }
            console.log(updateResults.values)
            console.log("Update result:", updateResults);
            
            if (updateResults.affectedRows === 0) {
                return res.status(400).json({ message: "Error: Skill points update failed" });
            }

            res.status(200).json({
                user_id: userId,
                skillpoints: updatedSkillPoints,
                message: `Skill points updated successfully! New total: ${updatedSkillPoints}`
            });
        });
    });
};

