const model = require("../models/reviewModel.js");

module.exports.createReview = (req, res, next) => {
    // Extract review_amt from the request body
    const review_amt = req.body.review_amt;
    const reviewText = req.body.reviewText;

    // Log the data for debugging
    console.log("Review Amount:", review_amt);
    console.log("Review Text:", reviewText);

    // Validate review_amt
    if (review_amt === undefined) {
        res.status(400).send("Error: review_amt is undefined");
        return;
    } else if (review_amt > 5 || review_amt < 1) {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    }

    // Check if reviewText is provided
    if (!reviewText || reviewText.trim() === "") {
        res.status(400).send("Error: Review text is required");
        return;
    }

    // Prepare data to be inserted into the database
    const data = {
        user_id: res.locals.userId,  
        review_amt: review_amt,
        reviewText: reviewText
    };

    // Callback function to handle the database insertion response
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating review:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);  // Send back the results of the insert
        }
    };

    // Insert the data into the database (assuming `model.insertSingle` handles this)
    model.insertSingle(data, callback);
};

module.exports.readReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Review not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllReview:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    model.selectAll(callback);
}

module.exports.updateReviewById = (req, res, next) => {
    console.log(req.body.review_amt)
    if (req.params.id === undefined) {
        res.status(400).send("Error: id is undefined");
        return;
    } else if (req.body.review_amt === undefined) {
        res.status(400).send("Error: review_amt is undefined");
        return;
    } else if (req.body.review_amt > 5 || req.body.review_amt < 1) {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    } else if (req.body.userId === undefined) {
        res.status(400).send("Error: userId is undefined");
        return;
    }

    const data = {
        id: req.params.id,
        userId: req.body.userId,
        review_amt: req.body.review_amt,
        review_text: req.body.review_text // Assuming review text is also sent in the request
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateReviewById:", error);
            res.status(500).json(error);
        } else {
            res.status(204).send();  // Send no content on success
        }
    };

    model.updateById(data, callback);
};
module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Review not found"
                });
            }
            else
            {
                res.status(204).send();
            }
        }
    }

    model.deleteById(data, callback);
}