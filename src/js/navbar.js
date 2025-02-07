window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop >= 300 || document.documentElement.scrollTop >= 300) {
    document.getElementById("navbar").style.padding = "10px";  
    document.getElementById("navbar").style.background = "rgb(223, 61, 110)";
  } else {
    document.getElementById("navbar").style.padding = "15px";  
    document.getElementById("navbar").style.background = "rgb(215, 0, 64)";
  }
}

function fetchMethod(url, callback, method = "GET", data = null, token = null) {
  if (!token) {
      token = localStorage.getItem("token"); // Try retrieving token from localStorage
  }
  console.log("fetchMethod: ", url, method, data);
  const headers = {};
  if (data) {
      headers["Content-Type"] = "application/json";
  }
  if (token) {
      headers["Authorization"] = "Bearer " + token;
  }
  let options = {
      method: method.toUpperCase(),
      headers: headers,
  };
  if (method.toUpperCase() !== "GET" && data !== null) {
      options.body = JSON.stringify(data);
  }
  fetch(url, options)
      .then((response) => {
          if (response.status == 401) {
              console.log("Unauthorized: Token might be invalid or expired.");
              localStorage.removeItem("token"); // Remove invalid token
              window.location.href = "login.html"; // Redirect to login page
          } else if (response.status == 204) {
              callback(response.status, {});
          } else {
              response.json().then((responseData) => callback(response.status, responseData));
          }
      })
      .catch((error) => console.error(`Error from ${method} ${url}:`, error));
}


function fetchUserSkillPoints() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    // Declare userId only once
    let userId; 

    // Decode the JWT safely
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded Token:", decodedToken); // Log the decoded token
    
        if (!decodedToken.userId) {
            console.error("userId is missing in the token.");
            return;
        }

        userId = decodedToken.userId; // Use the same variable name to store the extracted userId
        console.log("Extracted userId:", userId);

    } catch (error) {
        console.error("Error decoding the token:", error);
        return;
    }

    // Now you can use the same userId to make the API call
    fetchMethod(`http://localhost:3000/api/${userId}/readSkillpointsbyId`, (status, data) => {
            if (status === 200 && data && data.skillpoints !== undefined) {
                document.getElementById('skillPointsBalanceText').innerText = data.skillpoints;
            } else {
                console.error("Error: Unable to fetch skill points.");
            }
        },
        "GET"  
    );
}


setInterval(fetchUserSkillPoints, 10000000);

