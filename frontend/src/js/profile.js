const inventoryGrid = document.getElementById('inventoryGrid'); 
const profileContainer = document.getElementById('profileContainer');
const upgradeContainer = document.getElementById('upgradeContainer');
const totalSlotsPerPage = 10; 
const totalSlotsPerPageModal = 9;
let currentPage = 1;
let currentPageModal = 1; 


let userInventory = [];
let selectedMonkeyIds = []; 

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

console.log("Token:", token); // Log the raw token
console.log("Extracted userId after try:", userId); // Now userId should be accessible

function fetchInventory() {
    fetchMethod(`http://localhost:3000/api/${userId}/readInventorybyId`, (status, data) => {
        if (status === 200) {
            console.log("Fetched Inventory Data:", data); // Log the entire data object to inspect
    
            if (data.inventory && Array.isArray(data.inventory)) {
                userInventory = data.inventory.map(item => {
                    let imgPath;

                    console.log("Item:", item);

                    // Check for monkeyName first
                    switch(item.monkeyName) {
                        case "Dart Monkey":
                            if (item.monkeyUpgrade === '222') {
                                imgPath = `../../images/Paragon-ApexPlasmaMaster.png`;
                            } else if (item.monkeyUpgrade === '100') {
                                imgPath = `../../images/300-DartMonkey.webp`;
                            } else if (item.monkeyUpgrade === '010') {
                                imgPath = `../../images/030-DartMonkey.webp`;
                            } else if (item.monkeyUpgrade === '001') {
                                imgPath = `../../images/003-DartMonkey.webp`;
                            } else if (item.monkeyUpgrade === '200') {
                                imgPath = `../../images/500-DartMonkey.webp`;
                            } else if (item.monkeyUpgrade === '020') {
                                imgPath = `../../images/050-DartMonkey.webp`;
                            } else if (item.monkeyUpgrade === '002') {
                                imgPath = `../../images/005-DartMonkey.webp`;
                            } else {
                                imgPath = `../../images/000-DartMonkey.png`;  
                            }
                            break;
                        case "Dart Paragon": 
                            if (item.monkeyUpgrade === '222') {
                                imgPath = `../../images/Paragon-ApexPlasmaMaster.png`;
                            } else {
                                imgPath = ``;  
                            }
                            break;
                            case "Wizard Monkey":
                                // Check for specific upgrades for Wizard Monkey
                                if (item.monkeyUpgrade === '100') {
                                    imgPath = `../../images/300-WizardMonkey.png`;
                                } else if (item.monkeyUpgrade === '010') {
                                    imgPath = `../../images/030-WizardMonkey.png`;
                                } else if (item.monkeyUpgrade === '001') {
                                    imgPath = `../../images/003-WizardMonkey.png`;
                                } else if (item.monkeyUpgrade === '200') {
                                    imgPath = `../../images/500-WizardMonkey.png`;
                                } else if (item.monkeyUpgrade === '020') {
                                    imgPath = `../../images/050-WizardMonkey.png`;
                                } else if (item.monkeyUpgrade === '002') {
                                    imgPath = `../../images/005-WizardMonkey.png`;
                                } else if (item.monkeyUpgrade === '222') {
                                    imgPath = `../../images/Paragon-MagusPerfectus.png`;
                                } else {
                                    imgPath = `../../images/000-WizardMonkey.png`;  
                                }
                                break;
                        case "Wizard Paragon":
                            if (item.monkeyUpgrade === '222') {
                                imgPath = `../../images/Paragon-MagusPerfectus.png`;
                            } else {
                                imgPath = ``;  
                            }
                            break;
                        case "Engineer Monkey":
                            imgPath = `../../images/000-EngineerMonkey.png`;
                            break;
                        case "Heli Pilot Monkey":
                            imgPath = `../../images/BTD6_Heli_Pilot.png`;
                            break;
                        case "Boomerang Monkey":
                            imgPath = `../../images/BTD6_Boomerang_Monkey.png`;
                            break;
                        default:
                            imgPath = 'defaultimg'; 
                    }                    
    
                    return {
                        image: imgPath,
                        name: item.monkeyName || "Unknown",
                        upgrade: item.monkeyUpgrade || "None",
                        monkeyId: item.monkeyId || "Unknown ID"
                    };
                });
    
                // Log the inventory data to see it in the console
                userInventory.forEach(item => {
                    console.log(item.image); // Log the image path
                    console.log(item.name); // Log the monkey name
                    console.log(item.upgrade); // Log the upgrade
                    console.log(item.monkeyId); // Log the monkey ID
                });
    

                // Render the inventory grid after fetching the data
                renderInventoryGrid();
            } else {
                console.log("Invalid inventory data");
            }
    
        } else if (status === 404) {
            console.log("No inventory found for this user.");
    
            // Render the inventory grid (empty inventory)
            renderInventoryGrid();
    
        } else {
            console.error("Error fetching inventory:", data);
        }
    });    
}


// Event Listeners for pagination (if needed)
document.getElementById('nextPageBtn').addEventListener('click', () => {
    if (currentPage < 10) {
        currentPage++;
        document.getElementById('pageNumber').textContent = `Page ${currentPage}/10`;
        renderInventoryGrid();
        togglePageButtonVisibility();
    }
});

document.getElementById('backPageBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('pageNumber').textContent = `Page ${currentPage}/10`;
        renderInventoryGrid();
    }
    togglePageButtonVisibility();
});

// Switch to upgrade container when upgrade button is clicked
document.getElementById('upgradeContainerBtn').addEventListener('click', () => {
    profileContainer.style.display = 'none';  // Hides the profile container
    upgradeContainer.style.display = 'block';  // Shows the upgrade container
});
  
  // Switch back to inventory container when back button is clicked
document.getElementById('upgradeContainerBackBtn').addEventListener('click', () => {
    profileContainer.style.display = 'block';  // Shows the profile container
    upgradeContainer.style.display = 'none';   // Hides the upgrade container
});
  

document.getElementById('nextPageBtnModal').addEventListener('click', () => {
    currentPageModal++;
    document.getElementById('pageNumberModal').textContent = `Page ${currentPageModal}/10`;
    renderInventoryGridModal();
    toggleBackButtonVisibility();
});
document.getElementById('backPageBtnModal').addEventListener('click', () => {
    if (currentPageModal > 1) {
        currentPageModal--;
        document.getElementById('pageNumberModal').textContent = `Page ${currentPageModal}/10`;
        renderInventoryGridModal();
    }
    toggleBackButtonVisibility();
});
// Event listener for the "Upgrade Item" button
let lastClickedButton = null; // Track the last clicked upgrade button

// Modify existing event listeners to track which button was clicked
document.getElementById('upgradeItem1').addEventListener('click', () => {
    lastClickedButton = 'upgradeItem1';
    console.log('Clicked:', lastClickedButton);
    renderInventoryGridModal();
});
document.getElementById('upgradeItem2').addEventListener('click', () => {
    lastClickedButton = 'upgradeItem2';
    renderInventoryGridModal();
});
document.getElementById('upgradeItem3').addEventListener('click', () => {
    lastClickedButton = 'upgradeItem3';
    renderInventoryGridModal();
});
document.getElementById('upgradedItem').addEventListener('click', () => {
    if (selectedMonkeyIds.length !== 3) {
        alert("Please select 3 monkeys for the upgrade!");
        return;
    }

    const selectedButtons = ['upgradeItem1', 'upgradeItem2', 'upgradeItem3'];
    selectedButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.innerHTML = '';
            button.style.backgroundImage = 'none';
        }
    });

    const paragonMapping = {
        'Dart Monkey': 9,
        'Wizard Monkey': 10
    };

    const selectedMonkeyNames = selectedMonkeyIds.map(monkeyId => {
        const monkey = userInventory.find(item => item.monkeyId === monkeyId);
        return monkey ? monkey.name : null;
    });

    console.log("Selected monkeys for upgrade:", selectedMonkeyNames);

    // Check if all selected monkeys are valid for upgrade
    const allValidMonkeys = selectedMonkeyNames.every(name => name && paragonMapping[name]);
    if (!allValidMonkeys) {
        alert("One or more monkeys are not valid for upgrading.");
        return;
    }

    let removalSuccessCount = 0;

    // Remove each monkey from inventory
    selectedMonkeyIds.forEach(monkeyId => {
        fetchMethod(`http://localhost:3000/api/${userId}/removeMonkey/${monkeyId}`, (status, data) => {
            if (status === 200 || data.success) {
                console.log(`Monkey ${monkeyId} removed successfully.`);
                removalSuccessCount++; 

                if (removalSuccessCount === selectedMonkeyIds.length) {
                    const paragonMonkeyId = paragonMapping[selectedMonkeyNames[0]]; 
                    alert("Your upgrade has gone successfully! You now have a new PARAGON!!!");
                    giveMonkeyToUser(userId, paragonMonkeyId);
                }
            } else {
                alert(`Error removing monkey ${monkeyId}. Response: ${JSON.stringify(data)}`);
            }
        }, "PUT", {});
    });
});



// Function to toggle visibility of the back button
function togglePageButtonVisibility() {
    const nextPageBtn = document.getElementById('nextPageBtn');
    const nextPageBtnModal = document.getElementById('nextPageBtnModal');
    const backPageBtn = document.getElementById('backPageBtn');
    const backPageBtnModal = document.getElementById('backPageBtnModal');
  
    if (currentPage < 10) {
        nextPageBtn.style.opacity = '1';
        nextPageBtnModal.style.opacity = '1';
    } else {
        nextPageBtn.style.opacity = '0.5';
        nextPageBtnModal.style.opacity = '0.5';
    }

    if (currentPage > 1) {
        backPageBtn.style.opacity = '1';
        backPageBtnModal.style.opacity = '1';
    } else {
        backPageBtn.style.opacity = '0.5';
        backPageBtnModal.style.opacity = '0.5';
    }
}

// Function to render inventory grid dynamically in the main view
function renderInventoryGrid() {
    inventoryGrid.innerHTML = ''; // Clear existing slots

    // Get items for the current page
    const startIndex = (currentPage - 1) * totalSlotsPerPage;
    const pageItems = userInventory.slice(startIndex, startIndex + totalSlotsPerPage);

    for (let i = 0; i < totalSlotsPerPage; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventoryItem';

        // Check if there's an item in this slot
        if (pageItems[i]) {
            const img = document.createElement('img');
            img.src = pageItems[i].image;
            img.alt = pageItems[i].name;
            img.className = 'inventory-image';
            slot.appendChild(img);
        } else {
            // Empty slot
            const img = document.createElement('img');
            img.alt = '';
            img.className = 'inventory-image';
            slot.appendChild(img);
        }

        inventoryGrid.appendChild(slot);
    }
    console.log(`Rendering inventory for page: ${currentPage}`);
}

function renderInventoryGridModal() {
    const inventoryGridModal = document.getElementById('ModalinventoryGrid'); // Get inventory grid inside modal
    inventoryGridModal.innerHTML = ''; // Clear existing items

    // Get items for the current modal page
    const startIndex = (currentPageModal - 1) * totalSlotsPerPageModal;
    const pageItems = userInventory.slice(startIndex, startIndex + totalSlotsPerPageModal);

    // Ensure exactly 9 slots per page (fill empty slots if necessary)
    const itemsToDisplay = [...pageItems, ...new Array(totalSlotsPerPageModal - pageItems.length).fill(null)];

    // Render items in the modal grid
    itemsToDisplay.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'inventoryItemModal';

        const img = document.createElement('img');
        img.src = item ? item.image : '';
        img.alt = item ? item.name : '';
        img.className = 'inventory-image-modal';

        // Add a click event listener to make the image clickable
        img.addEventListener('click', function() {
            if (item) {
                handleItemClick(img, item);
            }
        });

        slot.appendChild(img);
        inventoryGridModal.appendChild(slot);
    });

    if (!document.getElementById('inventoryGridModal').classList.contains('show')) {
        const modal = new bootstrap.Modal(document.getElementById('inventoryGridModal'));
        modal.show();
    }
}

let selectedImage = null;
let selectedMonkeys = {};

function handleItemClick(img, item) {
    console.log('Item clicked:', item);

    if (Object.values(selectedMonkeys).includes(item.monkeyId)) {
        console.log('This monkey has already been selected for another button. Please choose another monkey.');
        return; 
    }

    const button = document.getElementById(lastClickedButton);

    if (button) {
        let img = button.querySelector('img');

        // If no image is appended yet, create and append it
        if (!img) {
            img = document.createElement('img');
            img.className = 'upgradeItem';
            button.appendChild(img);
        }

        // Set the image and alt text for the clicked item
        if (item) {
            img.src = item.image;
            img.alt = item.name;
            selectedMonkeys[lastClickedButton] = item.monkeyId; // Store the selected monkey ID per button
        }

        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    checkMonkeysWithUpgrades(userInventory, item);
}


function checkMonkeysWithUpgrades(userInventory) {
    selectedMonkeyIds = []; // Reset before checking

    console.log("Checking selected monkeys for upgrades...");

    for (const button in selectedMonkeys) {
        const monkeyId = selectedMonkeys[button];
        const selectedItem = userInventory.find(item => item.monkeyId === monkeyId);

        if (selectedItem && selectedItem.name && selectedItem.upgrade) {
            const monkeyName = selectedItem.name;
            const monkeyUpgrade = selectedItem.upgrade;

            console.log(`Checking ${monkeyName} (ID: ${monkeyId}) with upgrade ${monkeyUpgrade}`);

            if (['200', '020', '002'].includes(monkeyUpgrade)) {
                selectedMonkeyIds.push(monkeyId); // Store monkey ID
                console.log(`${monkeyName} has a valid upgrade.`);
            } else {
                console.log(`${monkeyName} does NOT have a valid upgrade.`);
            }
        }
    }


    const upgradedItem = document.getElementById('upgradedItem');
    if (selectedMonkeyIds.length >= 3) {
        upgradedItem.style.opacity = '1';
        upgradedItem.disabled = false;
        upgradedItem.style.pointerEvents = 'auto'; 
        console.log('Selected monkeys with valid upgrades:', selectedMonkeyIds);
    } else {
        console.log('Error');
    }
}



// Initial render for the inventory grid
renderInventoryGrid();
document.getElementById('pageNumber').textContent = `Page 1/10`;
document.getElementById('pageNumberModal').textContent = `Page 1/10`;
togglePageButtonVisibility(); 

setInterval(fetchInventory, 1000)