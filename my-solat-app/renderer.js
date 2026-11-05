
// GET CURRENT DATE

const currentDate = document.getElementById("currentDate");

const today = new Date();

currentDate.textContent = today.toLocaleDateString(
    "en-MY",
    {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }
);


// NAVIGATION BETWEEN PAGES

const navButtons = document.querySelectorAll(".nav-btn");

const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons
        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Hide all pages
        pages.forEach(page => {
            page.classList.remove("active");
        });

        // Activate selected button
        button.classList.add("active");

        // Display selected page
        const pageId = button.dataset.page;

        document.getElementById(pageId).classList.add("active");

    });

});


// PRAYER BUTTON TEMPORARY MESSAGE


// ========================================
// PRAYER TIMES API INTEGRATION
// ========================================

// Coordinates for supported Malaysian locations
const locations = {
    "Johor Bahru": {
        latitude: 1.4927,
        longitude: 103.7414
    },

    "Kuala Lumpur": {
        latitude: 3.1390,
        longitude: 101.6869
    },

    "Kota Bharu": {
        latitude: 6.1254,
        longitude: 102.2381
    },

    "Kuantan": {
        latitude: 3.8077,
        longitude: 103.3260
    },

    "George Town": {
        latitude: 5.4141,
        longitude: 100.3288
    },

    "Ipoh": {
        latitude: 4.5975,
        longitude: 101.0901
    },

    "Melaka City": {
        latitude: 2.1896,
        longitude: 102.2501
    },

    "Seremban": {
        latitude: 2.7258,
        longitude: 101.9424
    },

    "Alor Setar": {
        latitude: 6.1248,
        longitude: 100.3678
    },

    "Kangar": {
        latitude: 6.4414,
        longitude: 100.1986
    },

    "Kota Kinabalu": {
        latitude: 5.9804,
        longitude: 116.0735
    },

    "Kuching": {
        latitude: 1.5533,
        longitude: 110.3592
    },

    "Shah Alam": {
        latitude: 3.0738,
        longitude: 101.5183
    },

    "Putrajaya": {
        latitude: 2.9264,
        longitude: 101.6964
    },

    "Kuala Terengganu": {
        latitude: 5.3302,
        longitude: 103.1408
    }
};


// HTML elements

const citySelect = document.getElementById("city");
const apiMessage = document.getElementById("apiMessage");
const searchButton = document.getElementById("searchPrayer");


// Convert today's date into DD-MM-YYYY format
function getFormattedDate() {

    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
}


// Retrieve prayer times from AlAdhan API
async function loadPrayerTimes() {

    const selectedCity = citySelect.value;

    const location = locations[selectedCity];

    if (!location) {
        apiMessage.textContent = "Please select a valid location.";
        return;
    }

    try {

        apiMessage.textContent = "Loading prayer times...";

        // Prepare API parameters
        const date = getFormattedDate();

        const parameters = new URLSearchParams({
            latitude: location.latitude,
            longitude: location.longitude,
            method: 17,
            timezonestring: "Asia/Kuala_Lumpur"
        });

        // API URL
        const apiURL =
            `https://api.aladhan.com/v1/timings/${date}?${parameters}`;

        // Send API request
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("API request failed.");
        }

        // Convert API response into JSON
        const result = await response.json();

        if (result.code !== 200 || !result.data?.timings) {
            throw new Error("Invalid prayer time data.");
        }

        // Retrieve prayer times from JSON
        const timings = result.data.timings;

        // Display prayer times
        document.getElementById("subuh").textContent =
            timings.Fajr.split(" ")[0];

        document.getElementById("zohor").textContent =
            timings.Dhuhr.split(" ")[0];

        document.getElementById("asar").textContent =
            timings.Asr.split(" ")[0];

        document.getElementById("maghrib").textContent =
            timings.Maghrib.split(" ")[0];

        document.getElementById("isyak").textContent =
            timings.Isha.split(" ")[0];

        updateSuggestion(timings);
        updateCountdown(timings);

        // Display successful message
        apiMessage.textContent =
            `Prayer times loaded successfully for ${selectedCity}.`;

    }

    catch (error) {

        console.error("Prayer API Error:", error);

        apiMessage.textContent =
            "Unable to retrieve prayer times. Please check your internet connection and try again.";

    }
}


// Button event handler
searchButton.addEventListener("click", loadPrayerTimes);


// Automatically retrieve prayer times when application opens
loadPrayerTimes();
// ========================================
// STEP 5: ACTIVITY SUGGESTION LOGIC
// ========================================

function updateSuggestion(timings) {

    // Get current time
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Convert prayer time into minutes
    function convertToMinutes(time) {
        const parts = time.split(":");
        return Number(parts[0]) * 60 + Number(parts[1]);
    }

    const subuh = convertToMinutes(timings.Fajr);
    const zohor = convertToMinutes(timings.Dhuhr);
    const asar = convertToMinutes(timings.Asr);
    const maghrib = convertToMinutes(timings.Maghrib);
    const isyak = convertToMinutes(timings.Isha);

    const suggestion = document.getElementById("suggestion");

    // Activity suggestion using if-else
    if (currentTime < subuh) {

        suggestion.textContent =
            "Get ready for Subuh prayer and start your day with a fresh mind.";

    } else if (currentTime < zohor) {

        suggestion.textContent =
            "Good morning! Spend some time reading the Quran or studying.";

    } else if (currentTime < asar) {

        suggestion.textContent =
            "After Zohor, take a short rest and continue your daily activities.";

    } else if (currentTime < maghrib) {

        suggestion.textContent =
            "After Asar, you can do some light exercise or outdoor activities.";

    } else if (currentTime < isyak) {

        suggestion.textContent =
            "After Maghrib, spend some time reading or studying.";

    } else {

        suggestion.textContent =
            "After Isyak, relax and prepare yourself for tomorrow.";
    }
}

// ========================================
// STEP 6: NEXT PRAYER COUNTDOWN
// ========================================

let countdownInterval = null;

function updateCountdown(timings) {

    // Prayer names and their API times
    const prayerTimes = [
        { name: "Subuh", time: timings.Fajr },
        { name: "Zohor", time: timings.Dhuhr },
        { name: "Asar", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isyak", time: timings.Isha }
    ];

    function displayCountdown() {

        const now = new Date();
        let nextPrayer = null;

        // Find the next upcoming prayer
        for (let prayer of prayerTimes) {

            const timeParts = prayer.time.split(" ")[0].split(":");

            const prayerDate = new Date();

            prayerDate.setHours(
                Number(timeParts[0]),
                Number(timeParts[1]),
                0,
                0
            );

            if (prayerDate > now) {
                nextPrayer = {
                    name: prayer.name,
                    date: prayerDate
                };

                break;
            }
        }

        // If all prayers have passed, choose tomorrow's Subuh
        if (nextPrayer === null) {

            const timeParts = prayerTimes[0].time
                .split(" ")[0].split(":");

            const tomorrow = new Date();

            tomorrow.setDate(tomorrow.getDate() + 1);

            tomorrow.setHours(
                Number(timeParts[0]),
                Number(timeParts[1]),
                0,
                0
            );

            nextPrayer = {
                name: "Subuh",
                date: tomorrow
            };
        }

        // Calculate remaining time
        const difference = nextPrayer.date - now;

        const hours = Math.floor(difference / 3600000);

        const minutes = Math.floor(
            (difference % 3600000) / 60000
        );

        const seconds = Math.floor(
            (difference % 60000) / 1000
        );

        // Display the result
        document.getElementById("nextPrayer").textContent =
            "Next prayer: " + nextPrayer.name;

        document.getElementById("countdown").textContent =
            String(hours).padStart(2, "0") + ":" +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }

    // Stop the previous countdown
    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
    }

    // Update immediately and every second
    displayCountdown();

    countdownInterval = setInterval(displayCountdown, 1000);
}



// ========================================
// STEP 7: LOCAL STORAGE CRUD
// ========================================

// Get HTML elements
const reminderForm = document.getElementById("reminderForm");
const activityName = document.getElementById("activityName");
const activityDate = document.getElementById("activityDate");
const activityTime = document.getElementById("activityTime");
const reminderList = document.getElementById("reminderList");
const saveBtn = document.getElementById("saveBtn");
const cancelEdit = document.getElementById("cancelEdit");

let reminders = [];

function loadReminders() {

    const savedData = localStorage.getItem("solatReminders");

    if (savedData) {
        reminders = JSON.parse(savedData);
    } else {
        reminders = [];
    }

    displayReminders();
}

let editingId = null;


// SAVE REMINDERS
function saveReminders() {

    localStorage.setItem(
        "solatReminders",
        JSON.stringify(reminders)
    );
}


// DISPLAY REMINDERS
function displayReminders() {

    reminderList.innerHTML = "";

    if (reminders.length === 0) {
        reminderList.textContent = "No activities saved yet.";
        return;
    }

    reminders.forEach(reminder => {

        const li = document.createElement("li");

        const details = document.createElement("p");

        details.textContent =
            reminder.name + " | " +
            reminder.date + " | " +
            reminder.time;

        const actions = document.createElement("div");
        actions.className = "reminder-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", () => {
            editReminder(reminder.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteReminder(reminder.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(details);
        li.appendChild(actions);

        reminderList.appendChild(li);
    });
}


// CREATE AND UPDATE REMINDERS
reminderForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = activityName.value.trim();
    const date = activityDate.value;
    const time = activityTime.value;

    if (!name || !date || !time) {
        alert("Please complete all fields.");
        return;
    }

    if (editingId === null) {

        // CREATE
        const newReminder = {
            id: Date.now(),
            name: name,
            date: date,
            time: time
        };

        reminders.push(newReminder);

        alert("Activity added successfully!");

    } else {

        // UPDATE
        reminders = reminders.map(reminder => {

            if (reminder.id === editingId) {

                return {
                    ...reminder,
                    name: name,
                    date: date,
                    time: time
                };
            }

            return reminder;
        });

        alert("Activity updated successfully!");
    }

    saveReminders();
    displayReminders();

    reminderForm.reset();
    editingId = null;

    saveBtn.textContent = "Add Reminder";
    cancelEdit.style.display = "none";
});


// EDIT REMINDERS
function editReminder(id) {

    const reminder = reminders.find(item => item.id === id);

    if (!reminder) return;

    activityName.value = reminder.name;
    activityDate.value = reminder.date;
    activityTime.value = reminder.time;

    editingId = id;

    saveBtn.textContent = "Update Reminder";
    cancelEdit.style.display = "inline-block";
}


// DELETE REMINDERS
function deleteReminder(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this activity?"
    );

    if (confirmation) {

        reminders = reminders.filter(
            reminder => reminder.id !== id
        );

        saveReminders();
        displayReminders();

        if (editingId === id) {
            reminderForm.reset();
            editingId = null;
            saveBtn.textContent = "Add Reminder";
            cancelEdit.style.display = "none";
        }

        alert("Activity deleted successfully!");
    }
}


// CANCEL EDITING
cancelEdit.addEventListener("click", function() {

    reminderForm.reset();

    editingId = null;

    saveBtn.textContent = "Add Reminder";
    cancelEdit.style.display = "none";
});


// DISPLAY SAVED DATA WHEN APPLICATION STARTS
// Load reminders when the application starts
loadReminders();