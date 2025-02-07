document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    // Add click event to each star
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));

            // Update star states
            updateStars(selectedRating);
        });
    });

    // Update the star buttons based on the selected rating
    function updateStars(review_amt) {
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-value')) <= review_amt) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
});


// Fetch all reviews for a challenge
function getAllReviews() {
    fetchMethod(`http://localhost:3000/api/readAllReview`, (status, reviews) => {
        if (status === 200) {
            displayReviews(reviews);
        } else {
            console.error("Failed to load reviews");
        }
    }, "GET");
}


// Display all reviews in the DOM
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById("reviewsList");
    reviewsContainer.innerHTML = "";

    reviews.forEach((review) => {
        console.log(review);
        const reviewElement = `
            <div class="card mb-3" id="review-${review.user_id}">
                <div class="card-body">
                    <h5>${review.user_id} <span class="badge bg-warning">${review.review_amt} ★</span></h5>
                    <p>${review.review_text}</p>
                    <button class="btn btn-primary btn-sm" onclick="editReview('${review.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteReview('${review.id}')">Delete</button>
                </div>
            </div>
        `;
        reviewsContainer.insertAdjacentHTML("beforeend", reviewElement);
    });
}
document.getElementById("submitReviewBtn").addEventListener("click", () => {
    const review_amt = getSelectedRating();
    const review_text = document.getElementById("reviewText").value;

    if (!review_amt || !reviewText) {
        alert("Please provide a rating and a review.");
        return;
    }

    const newReview = {
        review_amt: review_amt, 
        reviewText: review_text
    };

    // Sending the data to the backend via fetch
    fetchMethod(`http://localhost:3000/api/createReview`, (status, response) => {
        if (status === 201) {
            alert("Review submitted successfully");
            document.getElementById("reviewText").value = review_text; 
            getAllReviews(); 
        } else {
            alert("Error submitting review");
        }
    }, "POST", newReview);
});

function getSelectedRating() {
    const stars = document.querySelectorAll(".star");
    let review_amt = null;
    stars.forEach((star, index) => {
        if (star.classList.contains("active")) {
            review_amt = index + 1;
        }
    });
    return review_amt;
}

function getReviewById(userId, reviewId, callback) {
    const url = `http://localhost:3000/api/${userId}/readReviewById/${reviewId}`;
    fetchMethod(url, (status, review) => {
        if (status === 200) {
            callback(null, review);
        } else {
            callback("Error fetching review", null);
        }
    }, "GET");
}

function editReview(reviewId) {
    getReviewById(userId, reviewId, (error, review) => {
        if (error) {
            alert(error);
        } else {
            const reviewText = prompt("Edit your review text:", review.review_text);
            if (!reviewText) {
                return;
            }

            const review_amt = getSelectedRating(); // Assuming you have a function to get the selected rating
            

            const updatedReview = {
                review_amt: review_amt,
                reviewText: reviewText
            };

            fetchMethod(`http://localhost:3000/api/${userId}/updateReviewById/${reviewId}`, (status, response) => {
                if (status === 200) {
                    alert("Review updated successfully");
                    getAllReviews(); // Refresh the list of reviews
                } else {
                    alert("Error updating review");
                }
            }, "PUT", updatedReview);
        }
    });
}



function deleteReview(reviewId) {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (confirmed) {
        fetchMethod(`http://localhost:3000/api/deleteReviewById`, (status, response) => {
            if (status === 200) {
                alert("Review deleted");
                document.getElementById(`review-${reviewId}`).remove(); 
            } else {
                alert("Error deleting review");
            }
        }, "DELETE");
    }
}


getAllReviews();
