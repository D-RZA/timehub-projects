const clock = document.getElementById("clock");
const ampmEl = document.getElementById("ampm");
const dateEl = document.getElementById("date");
const local = document.getElementById("local");

function updateClock() {

  const now = new Date();

  const localTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone;

local.textContent =
  getUTCOffset(localTimeZone);

  let hours = now.getHours();

  const minutes =
    now.getMinutes().toString().padStart(2, "0");

  const seconds =
    now.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  hours = hours.toString().padStart(2, "0");

  clock.textContent = `${hours}:${minutes}:${seconds}`;
  ampmEl.textContent = ampm;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  dateEl.textContent = now.toLocaleDateString(undefined, options);

}

updateClock();
setInterval(updateClock, 1000);


// ================================
// Page Navigation
// ================================

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");

const savedPage = localStorage.getItem("activePage");

const initialPage = savedPage || "clockSection";

showPage(initialPage);

const initialButton = document.querySelector(`[data-page="${initialPage}"]`

);

setActiveButton(initialButton);

function showPage(pageId) {

  // Hide every page
  pages.forEach((page) => {
    page.classList.add("hidden");
  });

  // Find the selected page
  const selectedPage = document.getElementById(pageId);

  // Show it
  selectedPage.classList.remove("hidden");
}

function setActiveButton(button) {

  // Remove active class from every button
  navButtons.forEach((btn) => {
    btn.classList.remove("bg-primary");
  });

  // Activate the clicked button
  button.classList.add("bg-primary");
};

// Add click event to every navigation button

navButtons.forEach((button) => {

  button.addEventListener("click", () => {

    setActiveButton(button);

    const pageId = button.dataset.page;

    showPage(pageId);

    localStorage.setItem("activePage", pageId);

  });
});

//stopwatch

const stopwatchDisplay = document.getElementById("stopwatchDisplay");

let startTime = 0;
let elapsedTime = 0;
let timer = null;
let isRunning = false;


const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resetBtn = document.getElementById("resetBtn");

// Start the stopwatch when the user clicks the "Start" button

function saveStopwatch() {

  const stopwatchData = {
    startTime,
    elapsedTime,
    isRunning
  };

  localStorage.setItem(
    "stopwatch",
    JSON.stringify(stopwatchData)
  );
}

function updateStopwatchDisplay() {

  const milliseconds = elapsedTime % 1000;
  const seconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  const formattedHours =
    hours.toString().padStart(2, "0");

  const formattedMinutes =
    displayMinutes.toString().padStart(2, "0");

  const formattedSeconds =
    displaySeconds.toString().padStart(2, "0");

  const formattedMilliseconds =
    milliseconds.toString().padStart(3, "0");

  stopwatchDisplay.textContent =
    `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

startBtn.addEventListener("click", () => {

  if (isRunning) return;

  startTime = Date.now() - elapsedTime;

  isRunning = true;

  saveStopwatch();

  timer = setInterval(() => {

    elapsedTime = Date.now() - startTime;

    updateStopwatchDisplay();

  }, 10);

});

// Pause the stopwatch when the user clicks the "Pause" button

pauseBtn.addEventListener("click", () => {

  if (!isRunning) return;

  clearInterval(timer);
  timer = null;
  isRunning = false;

  saveStopwatch();

});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  timer = null;

  elapsedTime = 0;

  localStorage.removeItem("stopwatch");

  stopwatchDisplay.textContent = "00:00:00.000";
});

const savedStopwatch =
  localStorage.getItem("stopwatch");

if (savedStopwatch) {

  const stopwatchData =
    JSON.parse(savedStopwatch);

  startTime = stopwatchData.startTime;
  elapsedTime = stopwatchData.elapsedTime;
  isRunning = stopwatchData.isRunning;

  if (isRunning) {

    elapsedTime =
      Date.now() - startTime;

    timer = setInterval(() => {

      elapsedTime =
        Date.now() - startTime;

      updateStopwatchDisplay();

    }, 10);

  }

  updateStopwatchDisplay();
};

//timer

const timerDisplay = document.getElementById("timerDisplay");

const timerHours = document.getElementById("timerHours");
const timerMinutes = document.getElementById("timerMinutes");
const timerSeconds = document.getElementById("timerSeconds");

const timerStartBtn = document.getElementById("timerStartBtn");
const timerPauseBtn = document.getElementById("timerPauseBtn");
const timerResetBtn = document.getElementById("timerResetBtn");


let totalSeconds = 0;
let timerInterval = null;
let timerRunning = false;
let timerStarted = false;
let timerEndTime = null;

// Start the timer when the user clicks the "Start" button

function saveTimer() {
  const timerData = {
    totalSeconds,
    timerRunning,
    timerStarted,
    timerEndTime
  };

  localStorage.setItem(
    "timer",
    JSON.stringify(timerData)
  );

}

timerStartBtn.addEventListener("click", () => {

  if (timerRunning) return;

  if (!timerStarted) {

    const hours = Number(timerHours.value);
    const minutes = Number(timerMinutes.value);
    const seconds = Number(timerSeconds.value);


    totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalSeconds <= 0) return;

    timerStarted = true;

  }

  timerEndTime = Date.now() + totalSeconds * 1000;

  updateTimerDisplay();

  timerRunning = true;

  saveTimer();

  runTimer();

});

function runTimer() {

  timerInterval = setInterval(() => {

    totalSeconds = Math.max(
      0,
      Math.ceil((timerEndTime - Date.now()) / 1000)
    );

    updateTimerDisplay();

    if (totalSeconds <= 0) {

      clearInterval(timerInterval);

      timerInterval = null;
      timerRunning = false;
      timerStarted = false;
      timerEndTime = null;

      localStorage.removeItem("timer");

      alert("Time's up!");
    }

  }, 1000);
}

// Pause the timer when the user clicks the "Pause" button

timerPauseBtn.addEventListener("click", () => {

  if (!timerRunning) return;

  totalSeconds = Math.max(0,

    Math.ceil((timerEndTime - Date.now()) / 1000)

  );

  clearInterval(timerInterval);

  timerInterval = null;

  timerRunning = false;

  timerEndTime = null;

  updateTimerDisplay();

  saveTimer();

});

// Update the timer display based on totalSeconds

function updateTimerDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  timerDisplay.textContent =
    `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
// Reset the timer when the user clicks the "Reset" button

timerResetBtn.addEventListener("click", () => {

  clearInterval(timerInterval);
  timerInterval = null;

  timerRunning = false;
  timerStarted = false;

  timerEndTime = null;

  totalSeconds = 0;

  localStorage.removeItem("timer");

  updateTimerDisplay();

});



const savedTimer = localStorage.getItem("timer");

if (savedTimer) {

  const timerData = JSON.parse(savedTimer);

  totalSeconds = timerData.totalSeconds;
  timerRunning = timerData.timerRunning;
  timerStarted = timerData.timerStarted;
  timerEndTime = timerData.timerEndTime;

  if (timerRunning && timerEndTime) {

    totalSeconds = Math.max(
      0,
      Math.ceil((timerEndTime - Date.now()) / 1000)
    );

    if (totalSeconds > 0) {

      updateTimerDisplay();

      runTimer();

    } else {

      timerRunning = false;
      timerStarted = false;
      timerEndTime = null;
      totalSeconds = 0;

      localStorage.removeItem("timer");

      updateTimerDisplay();
    }

  } else {

    updateTimerDisplay();
  }

}














//alarm


const alarmTime = document.getElementById("alarmTime");
const setAlarmBtn = document.getElementById("setAlarmBtn");
const clearAlarmBtn = document.getElementById("clearAlarmBtn");
const alarmStatus = document.getElementById("alarmStatus");
const alarmSound = new Audio("sounds/Eyedress.mp3");
const alarmList = document.getElementById("alarmList");


let alarmTimeValue = null;
let alarmTriggered = false;

const savedAlarm = localStorage.getItem("alarm");

if (savedAlarm) {
  const alarmData = JSON.parse(savedAlarm);

  alarmTimeValue = alarmData.time;
  alarmTriggered = false;

  alarmTime.value = alarmTimeValue;

  alarmStatus.textContent = `alarm set for ${alarmTimeValue}`;

  alarmList.innerHTML = `
    <div>
      <p>Alarm: ${alarmTimeValue}</p>
      <p>Status: Active </p>
      </div>
    `


}

// Set the alarm when the user clicks the "Set Alarm" button

setAlarmBtn.addEventListener("click", () => {

  if (alarmTime.value === "") {
    alarmStatus.textContent = "Please select a valid time for the alarm.";
    return;
  }

  alarmTimeValue = alarmTime.value;
  alarmTriggered = false;

  const alarmData = {
    time: alarmTimeValue,
    active: true
  };

  localStorage.setItem(
    "alarm",
    JSON.stringify(alarmData)
  );



  alarmStatus.textContent = `Alarm set for ${alarmTimeValue}`;

  alarmList.innerHTML = `
    <div>
     <p>Alarm: ${alarmTimeValue}</p>
    <p>Status: Active</p>
   </div>
  `;

});

// Check the alarm every second

setInterval(() => {

  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const currentTime =
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  if (currentTime === alarmTimeValue && !alarmTriggered) {



    alarmSound.play();

    alarmTriggered = true;

    localStorage.removeItem("alarm");

    alarmStatus.textContent = "Alarm Triggered";

    alarmList.innerHTML = `
    <div>
    <p>Alarm: ${alarmTimeValue}</p>
    <p>Status: Triggered</p>
    </div>
    `;
  }

}, 1000);

clearAlarmBtn.addEventListener("click", () => {
  alarmTimeValue = null;
  alarmTriggered = false;

  localStorage.removeItem("alarm");

  alarmSound.pause();
  alarmSound.currentTime = 0;

  alarmStatus.textContent = "No alarm set";

  alarmTime.value = "";

  alarmList.innerHTML = "";

});

const stopAlarmBtn = document.getElementById("stopAlarmBtn");

stopAlarmBtn.addEventListener("click", () => {

  if (!alarmTimeValue) return;

  const stoppedAlarmTime = alarmTimeValue;

  alarmSound.pause();

  alarmSound.currentTime = 0;

  alarmTriggered = true;

  localStorage.removeItem("alarm")

  alarmStatus.textContent = "Alarm Stopped";

  alarmList.innerHTML = `
    <div>
      <p>Alarm: ${stoppedAlarmTime}</p>
      <p>Status: Stopped</p>
    </div>
  `;

  alarmTimeValue = null;

});


//world clock


// Display the current time in London

function getUTCOffset(timeZone) {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset"
  });

  const parts = formatter.formatToParts(now);

  const timeZonePart = parts.find(
    (part) => part.type === "timeZoneName"
  );
  return timeZonePart.value
    .replace("GMT", "UTC")
    .replace(":00", "");
}

//

function getDayDifference(timeZone) {

  const now = new Date();

  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

  const cityDate = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

  const localDay = new Date(`${localDate}T00:00:00`);
  const cityDay = new Date(`${cityDate}T00:00:00`);

  const difference =
    Math.round((cityDay - localDay) / (1000 * 60 * 60 * 24));

  if (difference === 1) return "Tomorrow";
  if (difference === -1) return "Yesterday";
  return "Today";
}

function updateWorldClock(city) {

  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: city.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: city.timeZone,
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const utcOffset = getUTCOffset(city.timeZone);
  const dayDifference = getDayDifference(city.timeZone);

  city.clock.textContent = timeFormatter.format(now);
  city.date.textContent = dateFormatter.format(now);
  city.offset.textContent = utcOffset;
  city.day.textContent = dayDifference;

}

// 

function updateWorldClocks() {
  cityData.forEach((city) => {
    updateWorldClock(city);
  });
}


//world clock container

const worldClockContainer = document.getElementById("worldClockContainer");

const cityData = [
  {
    id: "lagos",
    name: "Lagos",
    timeZone: "Africa/Lagos"
  },

  {
    id: "london",
    name: "London",
    timeZone: "Europe/London"
  },

  {
    id: "newYork",
    name: "New York",
    timeZone: "America/New_York"
  },

  {
    id: "tokyo",
    name: "Tokyo",
    timeZone: "Asia/Tokyo"
  },
  {
    id: "beijing",
    name: "Beijing",
    timeZone: "Asia/Shanghai"
  },
  {
    id: "paris",
    name: "Paris",
    timeZone: "Europe/Paris"
  },
  {
    id: "singapore",
    name: "Singapore",
    timeZone: "Asia/Singapore"
  },
  {
    id: "madagascar",
    name: "Madagascar",
    timeZone: "Indian/Antananarivo"
  }
];

cityData.forEach((city) => {

  worldClockContainer.innerHTML += `
  <article
    class="rounded-2xl bg-base-100 p-6 shadow-sm ring-1 ring-base-content/5 transition-shadow duration-200 hover:shadow-md"
  >

    <div class="flex items-center justify-between">
      <h2 class="text-sm font-medium text-base-content/70">
        ${city.name}
      </h2>

      <span
        id="${city.id}Offset"
        class="rounded-full bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/60"
      >
      </span>
    </div>

    <p
      id="${city.id}Clock"
      class="mt-6 text-4xl font-semibold tracking-tight sm:text-4xl"
    >
    </p>

    <p
      id="${city.id}Date"
      class="mt-2 text-sm text-base-content/50"
    >
    </p>

    <p
  id="${city.id}Day"
  class="mt-1 text-xs font-medium text-base-content/40"
>
</p>

  </article>
`;

});

cityData.forEach((city) => {

  city.clock = document.getElementById(`${city.id}Clock`);
  city.date = document.getElementById(`${city.id}Date`);
  city.offset = document.getElementById(`${city.id}Offset`);
  city.day = document.getElementById(`${city.id}Day`);

});

updateWorldClocks();
setInterval(updateWorldClocks, 1000);

//theme toogle 

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

//local storage
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  root.dataset.theme = savedTheme;

  themeIcon.className = savedTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun ";

}

themeToggle.addEventListener("click", () => {
  const currentTheme = root.dataset.theme;

  const newTheme =
    currentTheme === "dark" ? "light" : "dark";

  root.dataset.theme = newTheme;

  localStorage.setItem("theme", newTheme);

  themeIcon.className =
    newTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun ";

});

//full screen 

// ================================
// Fullscreen
// ================================

const fullscreenToggle = document.getElementById("fullscreenToggle");

const fullscreenIcon = document.getElementById("fullscreenIcon");

fullscreenToggle.addEventListener("click", async () => {

  if (!document.fullscreenElement) {

    await document.documentElement.requestFullscreen();

  } else {

    await document.exitFullscreen();

  }

});

function updateFullscreenIcon() {

  if (document.fullscreenElement) {
    fullscreenIcon.classList.remove("fa-expand");
    fullscreenIcon.classList.add("fa-compress");
  } else {
    fullscreenIcon.classList.remove("fa-compress");
    fullscreenIcon.classList.add("fa-expand");
  }

};

document.addEventListener("fullscreenchange", updateFullscreenIcon);

//

