let isRunning = false;
let interval;
let mode = 'work'; // 'work' or 'break'
let workDuration = 25 * 60; // Default 25 minutes
let breakDuration = 5 * 60; // Default 5 minutes
let totalWorkTime = 0;
let totalBreakTime = 0;

const body = document.body;
const display = document.getElementById('timer-display');
const workInput = document.getElementById('work-duration');
const breakInput = document.getElementById('break-duration');
const startBtn = document.getElementById('start-btn');
const startBreakBtn = document.getElementById('start-break-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeTracked = document.getElementById('work-time-tracked');
const breakTimeTracked = document.getElementById('break-time-tracked');

function updateDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    let timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    display.textContent = timeString;
    document.title = timeString + " - " + (mode === 'work' ? "Work Time" : "Break Time"); // Update tab title
}

function startTimer(duration) {
    if (isRunning) return;
    isRunning = true;
    body.className = mode === 'work' ? 'work-session' : 'break-session';
    updateDisplay(duration);
    interval = setInterval(() => {
        if (duration <= 0) {
            clearInterval(interval);
            isRunning = false;
            if (mode === 'work') {
                totalWorkTime += parseInt(workInput.value) || 25;
                workTimeTracked.textContent = `Total Work: ${totalWorkTime} minutes`;
            } else {
                totalBreakTime += parseInt(breakInput.value) || 5;
                breakTimeTracked.textContent = `Total Break: ${totalBreakTime} minutes`;
            }
            alert(`Time is up! Start your ${mode === 'work' ? 'break' : 'work'} now.`);
            toggleMode();
            return;
        }
        duration--;
        updateDisplay(duration);
    }, 1000);
}

function stopTimer() {
    if (!isRunning) return;
    clearInterval(interval);
    isRunning = false;
    document.title = "Pomodoro Timer";
}

function resetTimer() {
    stopTimer();
    mode = 'work';
    updateDisplay(workDuration);
    toggleButtons(true);
    document.title = "Pomodoro Timer";
    body.className = ''; // Reset background color
}

function toggleMode() {
    if (mode === 'work') {
        mode = 'break';
        startTimer(breakDuration);
    } else {
        mode = 'work';
        startTimer(workDuration);
    }
    toggleButtons(false);
}

function toggleButtons(isWork) {
    startBtn.style.display = isWork ? '' : 'none';
    startBreakBtn.style.display = isWork ? 'none' : '';
}

startBtn.addEventListener('click', () => {
    workDuration = (workInput.value || 25) * 60;
    startTimer(workDuration);
});

startBreakBtn.addEventListener('click', () => {
    breakDuration = (breakInput.value || 5) * 60;
    startTimer(breakDuration);
});

stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize
updateDisplay(workDuration);
