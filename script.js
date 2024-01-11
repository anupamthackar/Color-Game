const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

let targetColor;
let options = [];

let score = 0;
let totalGuesses = 0;
let wrongGuesses = 0;
let chancesLeft = 15;

document.addEventListener('DOMContentLoaded', setupGame);

function setupGame() {
    if (chancesLeft <= 0) {
        alert('Game Over! You have used all your chances.');
        return;
    }

    targetColor = generateRandomColor();
    const redComponent = getRedComponent(targetColor);
    const greenComponent = getGreenComponent(targetColor);
    const blueComponent = getBlueComponent(targetColor);

    document.getElementById('color-to-guess').innerHTML = `
      <div class="rgb-component">R: ${redComponent}</div>
      <div class="rgb-component">G: ${greenComponent}</div>
      <div class="rgb-component">B: ${blueComponent}</div>
    `;

    options = [];
    options.push(targetColor);

    for (let i = 1; i < 4; i++) {
        let randomColor;
        do {
            randomColor = generateRandomColor();
        } while (options.includes(randomColor));
        options.push(randomColor);
    }

    shuffleArray(options);

    displayOptions();
    updateScoreboard();
}

function getRedComponent(color) {
    return parseInt(color.slice(1, 3), 16);
}

function getGreenComponent(color) {
    return parseInt(color.slice(3, 5), 16);
}

function getBlueComponent(color) {
    return parseInt(color.slice(5, 7), 16);
}

function displayOptions() {
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = ''; // Clear previous options

    options.forEach((optionColor, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.style.backgroundColor = optionColor;
        optionElement.setAttribute('onclick', 'checkGuess(this)');
        optionsContainer.appendChild(optionElement);
    });
}
function displayScorecard() {
    const accuracy = ((score / totalGuesses) * 100).toFixed(2);
    const message = `Score: ${score}\nTotal Guesses: ${totalGuesses}\nWrong Guesses: ${wrongGuesses}\nAccuracy: ${accuracy}%\n\nWell Done!`;

    alert(message);
}

function checkGuess(selectedOption) {
    totalGuesses++;

    const selectedColor = selectedOption.style.backgroundColor;
    const targetColorRgb = `rgb(${getRedComponent(targetColor)}, ${getGreenComponent(targetColor)}, ${getBlueComponent(targetColor)})`;

    // Remove any existing border from all options
    document.querySelectorAll('.option').forEach(option => {
        option.style.border = '';
    });

    if (selectedColor === targetColorRgb) {
        // User selected the correct option
        score++;

        // Highlight the correct option with a green border
        selectedOption.style.border = '2px solid green';

        // Remove the green border after 2 seconds
        setTimeout(() => {
            selectedOption.style.border = ''; // Set border to an empty string to remove it
            setupGame();
        }, 0.5*1000);
    } else {
        // User selected the wrong option
        wrongGuesses++;

        // Highlight the wrong option with a red border
        selectedOption.style.border = '2px solid red';

        // Remove the red border after 2 seconds
        setTimeout(() => {
            selectedOption.style.border = ''; // Set border to an empty string to remove it
            updateScoreboard();
        }, 0.5*1000);
    }

    chancesLeft--;

    if (chancesLeft <= 0) {
        displayScorecard();
    }
}


function updateScoreboard() {
    document.getElementById('score').textContent = score;
    document.getElementById('total-guesses').textContent = totalGuesses;
    document.getElementById('wrong-guesses').textContent = wrongGuesses;
    document.getElementById('chances-left').textContent = chancesLeft;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
