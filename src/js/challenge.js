let challenges = [];  // Declare challenges globally

const challengeContainer = document.getElementById("challengeContainer");

const token = localStorage.getItem("token");
if (!token) {
    console.error("User is not authenticated.");
}

let userId; 
try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    console.log("Decoded Token:", decodedToken); // Log the decoded token

    if (!decodedToken.userId) {
        console.error("userId is missing in the token.");
    }

    userId = decodedToken.userId; // Assign inside the try block
    console.log("Extracted userId:", userId);
} catch (error) {
    console.error("Error decoding token:", error);
}
function updateChallengePage() {
    fetchMethod("http://localhost:3000/api/readAllChallenges", (status, fetchedChallenges) => {
        if (status === 200) {
            challenges = fetchedChallenges;  // Store challenges in the global variable
            challengeContainer.innerHTML = ""; // Clear previous content
            challenges.forEach(challenge => {
                const challengeCard = `
                <div class="col-md-6 col-lg-4">
                    <div class="flip-card">
                        <div class="flip-card-inner" id="flipCard${challenge.challenge_id}">

                            <div class="flip-card-front card shadow-sm p-3 mb-5 position-relative">
                                <button class="btn btn-warning btn-sm position-absolute top-0 end-0 m-2 edit-btn" id="editBtn${challenge.challenge_id}" data-id="${challenge.challenge_id}">
                                    Edit
                                </button>

                                <button class="btn btn-danger btn-sm position-absolute top-0 start-0 m-2 delete-btn" id="deleteBtn${challenge.challenge_id}" data-id="${challenge.challenge_id}">
                                    Delete
                                </button>

                                <div class="card-body pt-4 pb-4"> <!-- Add padding to the top and bottom of the card body -->
                                    <h5 class="card-title">${challenge.challenge}</h5>
                                    <p class="card-text"><strong>Skill Points:</strong> ${challenge.skillpoints}</p>
                                    <div class="checkCompleteText" id="checkCompleteText${challenge.challenge_id}" data-id="${challenge.challenge_id}">
                                        Mark as Completed
                                    </div>
                                    <form id="completionForm${challenge.challenge_id}" class="mt-3">
                                        <label for="notes${challenge.challenge_id}" class="form-label">Notes:</label>
                                        <textarea id="notes${challenge.challenge_id}" name="notes" placeholder="Enter your notes..." class="form-control"></textarea>
                                        <input type="submit" value="Submit" class="btn btn-primary mt-2">
                                    </form>
                                </div>
                            </div>

                            <div class="flip-card-back card shadow-sm p-3">
                                <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 flip-back-btn" 
                                        data-id="${challenge.challenge_id}">
                                    Close
                                </button>
                                <div class="card-body">
                                    <h5 class="card-title">Edit Challenge</h5>
                                    <label for="editChallengeTitle${challenge.challenge_id}" class="form-label">Title:</label>
                                    <input type="text" id="editChallengeTitle${challenge.challenge_id}" class="form-control" value="${challenge.challenge}">

                                    <label for="editSkillPoints${challenge.challenge_id}" class="form-label mt-2">Skill Points:</label>
                                    <input type="number" id="editSkillPoints${challenge.challenge_id}" class="form-control" value="${challenge.skillpoints}">
                                    <button class="btn btn-success mt-3 save-edit-btn" data-id="${challenge.challenge_id}">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                challengeContainer.insertAdjacentHTML("beforeend", challengeCard);

                document.getElementById(`completionForm${challenge.challenge_id}`).addEventListener("submit", function (event) {
                    event.preventDefault(); // Prevent default form submission

                    const challengeId = challenge.challenge_id;
                    const notes = document.getElementById(`notes${challengeId}`).value.trim();

                    if (!notes) {
                        alert("Please enter some notes before submitting.");
                        return;
                    }

                    submitNotes(challengeId, notes); 
                    markChallengeCompleted(challengeId); 
                });
            });
        } else {
            console.error("Error fetching challenges:", fetchedChallenges);
        }
    });
}

document.addEventListener("click", (event) => {
    const challengeId = event.target.getAttribute("data-id");
    console.log('Challenge ID:', challengeId);

    if (event.target.classList.contains("edit-btn")) {
        document.getElementById(`flipCard${challengeId}`).classList.add("flip");
        console.log("Flipped")
    }

    if (event.target.classList.contains("flip-back-btn")) {
        document.getElementById(`flipCard${challengeId}`).classList.remove("flip");
    }

    if (event.target.classList.contains("save-edit-btn")) {
        const newTitle = document.getElementById(`editChallengeTitle${challengeId}`).value;
        const newSkillPoints = document.getElementById(`editSkillPoints${challengeId}`).value;
        updateChallengeDetails(challengeId, newTitle, newSkillPoints);

        document.querySelector(`#flipCard${challengeId} .flip-card-front .card-title`).textContent = newTitle;
        document.querySelector(`#flipCard${challengeId} .flip-card-front .card-text`).textContent = `Skill Points: ${newSkillPoints}`;

        document.getElementById(`flipCard${challengeId}`).classList.remove("flip");
    }
});

document.body.addEventListener('click', (event) => {
    // Check if the clicked element has the class 'delete-btn'
    if (event.target.classList.contains('delete-btn')) {
        const challengeId = event.target.getAttribute('data-id');
        deleteChallenge(challengeId);
        console.log('Delete button clicked for challenge:', challengeId);
    }
});

// Update challenge details
function updateChallengeDetails(challengeId, newTitle, newSkillPoints) {
    const challenge = newTitle;
    const skillpoints = newSkillPoints;

    // Make the PUT request to update the challenge using fetchMethod
    fetchMethod(`http://localhost:3000/api/${challengeId}/updateChallengeById`, (status, responseData) => {
        if (status === 200) {
            console.log('Challenge updated:', responseData);
            alert("Challenge details updated successfully!");
        } else {
            console.error('Error updating challenge:', responseData);
            alert("Only creators of the challenge can edit them!")
        }
    }, "PUT", { challenge: challenge, skillpoints: skillpoints });
}


// Function to submit notes to the server
function submitNotes(challengeId, notes) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    const data = { challenge_id: challengeId, notes: notes, completed: true };

    // Submit completion record
    fetchMethod(`http://localhost:3000/api/${challengeId}/createCompletionForChallenge`, (status, responseData) => {
        if (status === 201) {
            console.log('Completion Response:', responseData);
            alert("Challenge completed! Skill points awarded.");

            // Extract user ID and skill points from response
            const userId = responseData.userId;
            const skillpoints = responseData.skillpoints; // Assuming the API returns awarded skillpoints

            // Update user's skill points
            const updateUserData = { skillpoints: skillpoints };
            fetchMethod(`http://localhost:3000/api/${userId}/updateUserById`, (updateStatus, updateResponse) => {
                if (updateStatus === 200) {
                    console.log('Skill points updated:', updateResponse);
                    alert(`You have received ${skillpoints} skill points!`);

                    // Fetch updated participant list (to reflect the completed status)
                    fetchMethod(`http://localhost:3000/api/${challengeId}/getParticipantsByChallengeId`, (participantStatus, participantResponse) => {
                        if (participantStatus === 200) {
                            console.log('Participants:', participantResponse);
                        } else {
                            console.error('Error fetching participants:', participantResponse);
                        }
                    }, "GET", null, token);

                } else {
                    console.error('Error updating user skill points:', updateResponse);
                }
            }, "PUT", updateUserData, token);

        } else {
            console.error('Error submitting notes:', responseData);
        }
    }, "POST", data, token);
}

const completedChallenges = new Set();

function markChallengeCompleted(challengeId) {
    if (completedChallenges.has(challengeId)) return; 

    console.log(`Challenge ${challengeId} marked as completed!`);
    completedChallenges.add(challengeId);

    const button = document.getElementById(`checkCompleteText${challengeId}`);
    if (button) {
        button.disabled = true;
        button.classList.add("completed");
        button.textContent = "Completed";
    }
}

function deleteChallenge(challengeId) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    // Use fetchMethod to send the DELETE request
    fetchMethod(`http://localhost:3000/api/${challengeId}/deleteChallengeById`, (status, responseData) => {
        if (status === 200) {
            console.log('Challenge deleted successfully');
            alert('Challenge deleted successfully!');
            // Optionally, remove the challenge from the UI
            document.getElementById(`flipCard${challengeId}`).remove();
        } else {
            console.error('Error deleting challenge:', responseData);
            alert('Error deleting challenge');
        }
    }, "DELETE", null, token); // method is DELETE, no data needed
    updateChallengePage() 
}

document.getElementById("createChallengeForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById("createChallengeTitle").value.trim();
    const skillPoints = parseInt(document.getElementById("createSkillPoints").value.trim());

    if (!title || !skillPoints) {
        alert("Please provide valid inputs.");
        return;
    }

    // Data object to send in the POST request
    const newChallenge = {
        challenge: title,
        skillpoints: skillPoints,
    };

    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (!token) {
        console.error("User is not authenticated.");
        alert("You must be logged in to create a challenge.");
        return;
    }

    // Call fetchMethod with the URL and POST request
    fetchMethod("http://localhost:3000/api/createNewChallenge", (status, responseData) => {
        if (status === 201) {
            console.log('Challenge created successfully');
            alert('Challenge created successfully!');
            
            updateChallengePage(); 
            document.getElementById("createChallengeForm").reset();
        } else {
            console.error('Error creating challenge:', responseData);
            alert('Error creating challenge');
        }
    }, "POST", newChallenge, token);
});


updateChallengePage()