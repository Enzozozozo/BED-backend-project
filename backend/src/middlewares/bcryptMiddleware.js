//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
module.exports.comparePassword = (req, res, next) => {
  console.log("Running comparePassword middleware...");
  // Log the entered password and the stored hash for debugging
  console.log("Entered password:", req.body.password);
  console.log("Stored hash:", res.locals.hash);
  
  // Check if the entered password and the stored hash are being passed correctly
  console.log("Length of entered password:", req.body.password.length);
  console.log("Length of stored hash:", res.locals.hash.length);

  // Check password using bcrypt
  const callback = (err, isMatch) => {
    if (err) {
      console.error("Error bcrypt:", err);  // Log any bcrypt errors
      res.status(500).json(err);
    } else {
      console.log("Password comparison result:", isMatch);  // Log if password matches or not
      if (isMatch) {
        console.log("Password matched. Proceeding to next step.");
        next();  // Proceed to the next middleware if password matches
      } else {
        console.log("Password mismatch.");
        res.status(401).json({
          message: "Wrong password",  // Send wrong password error if mismatch
        });
      }
    }
  };

  // Ensure bcrypt.compare is being called correctly
  bcrypt.compare(req.body.password, res.locals.hash, callback);
};



//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
module.exports.hashPassword = (req, res, next) => {
  console.log("Running hashPassword middleware...");
  const callback = (err, hash) => {
    if (err) {
      console.error("Error bcrypt:", err);

      res.status(500).json(err);
    } else {
      // Log the hash to ensure it's being created correctly
      console.log("Hashed password:", hash);

      res.locals.hash = hash;  // Store the hashed password in res.locals
      next();
    }
  };

  bcrypt.hash(req.body.password, saltRounds, callback);  // Hash the password
};
