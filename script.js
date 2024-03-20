let isRunning = false;
let timerStarted = false; // Indicates if the timer has been started at least once
let startTime;
let remainingTime;
let interval;
let mode = 'work'; // Initial mode
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let totalWorkTime = 0;
let totalBreakTime = 0;

const body = document.body;
const display = document.getElementById('timer-display');
const workInput = document.getElementById('work-duration');
const breakInput = document.getElementById('break-duration');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeTracked = document.getElementById('work-time-tracked');
const breakTimeTracked = document.getElementById('break-time-tracked');
const workTab = document.getElementById('work-tab');
const breakTab = document.getElementById('break-tab');
const alarmSound = document.getElementById('alarm-sound');

function updateDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function switchMode(newMode) {
    mode = newMode;
    body.className = newMode + '-session'; // Change body class for background color
    // Update durations based on inputs
    workDuration = parseInt(workInput.value) * 60 || 25 * 60;
    breakDuration = parseInt(breakInput.value) * 60 || 5 * 60;
    updateDisplay(newMode === 'work' ? workDuration : breakDuration);
    
    if (newMode === 'work') {
        workInput.style.display = '';
        breakInput.style.display = 'none';
        workTab.classList.add('active-tab');
        breakTab.classList.remove('active-tab');
    } else {
        workInput.style.display = 'none';
        breakInput.style.display = '';
        workTab.classList.remove('active-tab');
        breakTab.classList.add('active-tab');
    }
}

function updateTimeTracking() {
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(0);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);

    if (mode === 'work') {
        totalWorkTime += elapsedMinutes;
        workTimeTracked.textContent = `Total Work: ${totalWorkTime} minutes`;
    } else {
        totalBreakTime += elapsedMinutes;
        breakTimeTracked.textContent = `Total Break: ${totalBreakTime} minutes`;
    }
}

function startTimer() {
    // Update durations based on inputs right before starting the timer
    workDuration = parseInt(workInput.value) * 60 || 25 * 60;
    breakDuration = parseInt(breakInput.value) * 60 || 5 * 60;

    if (!timerStarted || !isRunning) {
        startTime = Date.now();
        remainingTime = mode === 'work' ? workDuration : breakDuration;
        timerStarted = true;
    }
    
    isRunning = true;
    startPauseBtn.textContent = '⏸'; // Change button to show pause symbol
    interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        remainingTime = (mode === 'work' ? workDuration : breakDuration) - elapsedSeconds;
        
        if (remainingTime <= 0) {
            clearInterval(interval);
            isRunning = false;
            timerStarted = false;
            // Play the alarm sound when the timer finishes
            alarmSound.play();
            updateTimeTracking();
            switchMode(mode === 'work' ? 'break' : 'work'); // Automatically switch modes
            startPauseBtn.textContent = '►'; // Change button to show play symbol
        } else {
            updateDisplay(remainingTime);
        }
    }, 1000);
}


function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
    startPauseBtn.textContent = '►'; // Change button to show play symbol
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(0);
    remainingTime -= elapsedSeconds; // Adjust remaining time based on pause
}

function resetTimer() {
    if (timerStarted) {
        updateTimeTracking(); // Update time tracking with the current session before resetting
    }
    clearInterval(interval);
    isRunning = false;
    timerStarted = false;
    updateDisplay(mode === 'work' ? workDuration : breakDuration);
    startPauseBtn.textContent = '►'; // Reset button to show play symbol
}

// Event listeners for tab switches
workTab.addEventListener('click', () => switchMode('work'));
breakTab.addEventListener('click', () => switchMode('break'));

// Start/Pause button toggles timer state
startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

workInput.addEventListener('change', () => {
    workDuration = parseInt(workInput.value) * 60 || 25 * 60;
    if (mode === 'work') {
        updateDisplay(workDuration);
    }
});

breakInput.addEventListener('change', () => {
    breakDuration = parseInt(breakInput.value) * 60 || 5 * 60;
    if (mode === 'break') {
        updateDisplay(breakDuration);
    }
});


// Reset button functionality
resetBtn.addEventListener('click', resetTimer);

// Initialize
updateDisplay(workDuration);
switchMode('work');
