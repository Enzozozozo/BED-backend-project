const upgradeIcons = [
    ['../../images/ArcaneMasteryUpgradeIcon.webp', '../../images/ArchmageUpgradeIcon.webp', '../../images/BTD5_PC.webp', '../../images/BTD5_MU.webp'],
    ['../../images/DragonsBreathUpgradeIcon.webp', '../../images/WizardLordPhoenixUpgradeIcon.webp', '../../images/BTD5_PC.webp', '../../images/BTD5_MU.webp'],
    ['../../images/ShimmerUpgradeIcon.webp', '../../images/SoulbindUpgradeIcon.webp', '../../images/BTD5_PC.webp', '../../images/BTD5_MU.webp']
];

const upgradeTexts = [
    ['250 Skill Points', '750 Skill Points', 'Maxed Out!', 'Upgrade Locked'],
    ['250 Skill Points', '750 Skill Points', 'Maxed Out!', 'Upgrade Locked'],
    ['250 Skill Points', '750 Skill Points', 'Maxed Out!', 'Upgrade Locked']
];

const upgradeValue = [
    [250, 750],
    [250, 750],
    [250, 750]
];

const upgradeNames = [
    ['Default', 'Arcane Mastery', 'Archmage'],
    ['Default', "Dragon's Breath", 'Wizard Lord Phoenix'],
    ['Default', 'Shimmer', 'Prince of Darkness']
];

const monkeyIcons = [
    ['../../images/300-WizardMonkey.png', '../../images/300-WizardMonkey.png', '../../images/500-WizardMonkey.png'],
    ['../../images/030-WizardMonkey.png', '../../images/030-WizardMonkey.png', '../../images/050-WizardMonkey.png'],
    ['../../images/003-WizardMonkey.png', '../../images/003-WizardMonkey.png', '../../images/005-WizardMonkey.png']
];

const buyButton = document.getElementById('monkeyPriceButton');
const buyText = document.getElementById('monkeyPriceText');


let upgradeCycles = [0, 0, 0];
let totalUpgrades = 0; 
const selectedMonkeyIndex = 2;

function fetchMonkeyPrices() {
    fetchMethod(`http://localhost:3000/api/${selectedMonkeyIndex}/readMonkeybyId`, (status, data) => {
        if (status === 200) {
            monkeyPriceText = `${data.Price}`;
            monkeyPriceValue = data.Price;
            console.log("Monkey Prices Loaded:", monkeyPriceText, monkeyPriceValue);

            document.getElementById("monkeyPriceText").textContent = (`${monkeyPriceText} Skill Points`);  
        } else {
            console.error("Error fetching monkey prices:", data);
        }
    });
}

fetchMonkeyPrices();

  
buyButton.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('buyModal'));
    const originalText = buyText.textContent;
    const modalText = document.getElementById('buyModalText');
 
    modalText.textContent = `Are you sure you want to purchase for ${monkeyPriceText} Skill Points?`;
    
    buyText.textContent = 'Loading...';
    modal.show();

    setTimeout(() => {
        buyText.textContent = originalText;
    }, 500);
});

document.getElementById('confirmBuy').addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('buyModal'));
    modal.hide();

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    let userId; 
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded Token:", decodedToken); // Log the decoded token
    
        if (!decodedToken.userId) {
            console.error("userId is missing in the token.");
            return;
        }

        userId = decodedToken.userId; // Assign inside the try block
        console.log("Extracted userId:", userId);
    } catch (error) {
        console.error("Error decoding token:", error);
        return; // Exit the function if decoding fails
    }

    let skillPointsToDeduct = 0;

    console.log("Token:", token); // Log the raw token
    console.log("Extracted userId after try:", userId); // Now userId should be accessible

    fetchMethod(`http://localhost:3000/api/${selectedMonkeyIndex}/deductSkillPoints`, (deductStatus, deductData) => {
        if (deductStatus === 200 && deductData.success) {
            alert("Skill points deducted successfully! You now have a new monkey!");
            console.log('Remaining skill points after deduction:', deductData.remainingSkillPoints);
            giveMonkeyToUser(userId, selectedMonkeyIndex);
        } else {
            alert("Error deducting skill points.");
        }
    }, "PUT", { userId: userId, points: skillPointsToDeduct });
});


// Initialize buttons, icons, and set default upgrade name
for (let i = 0; i < 3; i++) {
    document.getElementById(`upgradeIcon${i + 1}`).src = upgradeIcons[i][0];
    document.getElementById(`upgradePrice${i + 1}`).textContent = upgradeTexts[i][0];
    document.getElementById(`upgradeBtn${i + 1}`).addEventListener('click', function () {
        handleUpgrade(i);
    });
}

document.getElementById('upgradeName').textContent = 'Default'; 

function handleUpgrade(i) {

    console.log(`Upgrading path ${i + 1}`);

    if (totalUpgrades === 0 || upgradeCycles[i] === 0) {
        disableOtherPaths(i);
    }

    if (upgradeCycles[i] >= 2) {
        alert("You're already maxed out on this path.");
        // Ensure the last upgrade icon is displayed when maxed out
        document.getElementById(`upgradeIcon${i + 1}`).src = upgradeIcons[i][3];
        return;
    }

    if (totalUpgrades < 2) {
        upgradeCycles[i]++;
        totalUpgrades++;

        // Update the icon and price for the upgrade
        if (upgradeCycles[i] < upgradeIcons[i].length) {
            document.getElementById(`upgradeIcon${i + 1}`).src = upgradeIcons[i][upgradeCycles[i]];
            document.getElementById(`upgradePrice${i + 1}`).textContent = upgradeTexts[i][upgradeCycles[i]];
            document.getElementById('myMonkey').src = monkeyIcons[i][upgradeCycles[i]];
        } else {
            console.error(`Index out of bounds for upgradeIcons or monkeyIcons at index ${i} and cycle ${upgradeCycles[i]}`);
        }

        // Set the last upgrade icon when maxed out
        if (upgradeCycles[i] === 2) {
            document.getElementById(`upgradeIcon${i + 1}`).src = upgradeIcons[i][3];
            document.getElementById(`upgradeBtn${i + 1}`).style.pointerEvents = "none";
            document.getElementById(`upgradeBtn${i + 1}`).classList.add('disabledBtn');
            console.log(`Path ${i + 1} is now maxed out.`);
        }

        // Apply the CSS class to all paths
        for (let j = 0; j < 3; j++) {
            applyCSSClassForLastIndexes(j, upgradeCycles[j]);
        }
        
    }

    // Change the upgrade name dynamically
    document.getElementById('upgradeName').textContent = upgradeNames[i][upgradeCycles[i]]; // Update the upgrade name
    sendUpgradeDataToBackend(i)
}


function sendUpgradeDataToBackend(i) {
    const monkeyId = selectedMonkeyIndex;  // Get the monkeyId for the upgrade path
    const upgradePrice = upgradeTexts[i][upgradeCycles[i]];
    
    // Create the data object with the upgrade cycles and other information
    const upgradeData = { 
        monkeyId: monkeyId,
        upgradeCycles: upgradeCycles, 
        upgradePrice: upgradePrice
    }; 

    // Use fetchMethod to send the POST request
    fetchMethod(`http://localhost:3000/api/${selectedMonkeyIndex}/${i}/deductSkillPointsUpgrade`, (status, data) => {
        if (status === 200 && data.success) { 
            console.log("Upgrade successful!");
        } else {
            console.error("Error during upgrade:", data.message || "Unknown error");
        }
    }, 'PUT', upgradeData); // Pass the upgrade data to the backend
}

function giveMonkeyToUser(userId, monkeyId) {
    console.log(`Giving monkey with ID ${monkeyId} to user ${userId}`);

    const data = {
        userId: userId, 
        monkeyId: monkeyId
    };

    fetchMethod(`http://localhost:3000/api/${monkeyId}/addMonkey`, (status, responseData) => {
        if (status === 200 && responseData.success) {
            console.log('Monkey given to the user successfully!');
        } else {
            console.error('Error giving monkey to the user:', responseData.message || 'Unknown error');
        }
    }, 'POST', data);  
}

// Function to apply CSS class to the last two indexes
function applyCSSClassForLastIndexes(i, cycle) {
    console.log(`Applying CSS: Index ${i}, Cycle ${cycle}`);
    document.getElementById(`upgradeIcon${i + 1}`).classList.remove('upgradeBlocked');

    if (cycle == 0 || cycle == 2) {
        document.getElementById(`upgradeIcon${i + 1}`).classList.add('upgradeBlocked');
    }
}

// Function to disable all other paths except the chosen one
function disableOtherPaths(chosenIndex) {
    console.log(`Disabling all paths except path ${chosenIndex + 1}`);
    for (let i = 0; i < 3; i++) {
        if (i !== chosenIndex) {
            // Disable the upgrade button
            document.getElementById(`upgradeBtn${i + 1}`).style.pointerEvents = "none";
            document.getElementById(`upgradeBtn${i + 1}`).classList.add('disabledBtn');

            // Update icons and text to indicate the path is locked
            document.getElementById(`upgradeIcon${i + 1}`).src = upgradeIcons[i][2];
            document.getElementById(`upgradePrice${i + 1}`).textContent = upgradeTexts[i][3];
        }
    }
}
