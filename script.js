const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const timerDisplay = document.querySelector('.timer');
const breathingText = document.querySelector('.breathing-text');

// Create audio elements
const breathInSound = new Audio('breathe-in-87397.mp3');
const breathOutSound = new Audio('breath-out-242642.mp3');

let isRunning = false;
let isPaused = false;
let timeLeft = 300; // 5 minutes in seconds
let intervalId = null;
let breathingInterval = null;
let timeoutIds = [];

function stopAllSounds() {
    breathInSound.pause();
    breathInSound.currentTime = 0;
    breathOutSound.pause();
    breathOutSound.currentTime = 0;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function breathingCycle() {
    // Breath in for 4 seconds
    breathingText.textContent = 'Breathe In...';
    breathInSound.play();
    
    let timeout1 = setTimeout(() => {
        if (!isPaused) {
            // Hold for 4 seconds
            breathingText.textContent = 'Hold...';
            
            let timeout2 = setTimeout(() => {
                if (!isPaused) {
                    // Breathe out for 4 seconds
                    breathingText.textContent = 'Breathe Out...';
                    breathOutSound.play();
                    
                    let timeout3 = setTimeout(() => {
                        if (!isPaused) {
                            // Hold for 4 seconds
                            breathingText.textContent = 'Hold...';
                        }
                    }, 4000);
                    timeoutIds.push(timeout3);
                }
            }, 4000);
            timeoutIds.push(timeout2);
        }
    }, 4000);
    timeoutIds.push(timeout1);
}

function resetMeditation() {
    // Clear all intervals
    clearInterval(intervalId);
    clearInterval(breathingInterval);
    
    // Clear all timeouts
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutIds = []; // Reset the array
    
    // Stop all sounds
    stopAllSounds();
    
    // Reset all states
    isRunning = false;
    isPaused = false;
    timeLeft = 300;
    startButton.textContent = 'Start Meditation';
    breathingText.textContent = 'Click Start to begin';
    updateTimer();
    stopButton.disabled = true;
}

startButton.addEventListener('click', () => {
    if (!isRunning) {
        // Starting new meditation
        isRunning = true;
        isPaused = false;
        startButton.textContent = 'Pause Meditation';
        stopButton.disabled = false;
        
        breathingCycle();
        breathingInterval = setInterval(breathingCycle, 16000);
        
        intervalId = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 0) {
                resetMeditation();
                breathingText.textContent = 'Meditation Complete';
            }
        }, 1000);
    } else if (!isPaused) {
        // Pausing meditation
        isPaused = true;
        clearInterval(intervalId);
        clearInterval(breathingInterval);
        stopAllSounds();
        startButton.textContent = 'Resume Meditation';
        breathingText.textContent = 'Meditation Paused';
    } else {
        // Resuming meditation
        isPaused = false;
        startButton.textContent = 'Pause Meditation';
        breathingText.textContent = 'Resuming...';
        
        breathingCycle();
        breathingInterval = setInterval(breathingCycle, 16000);
        
        intervalId = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 0) {
                resetMeditation();
                breathingText.textContent = 'Meditation Complete';
            }
        }, 1000);
    }
});

stopButton.addEventListener('click', () => {
    resetMeditation();
}); 