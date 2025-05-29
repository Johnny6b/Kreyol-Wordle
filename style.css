import { realDictionary } from './dictionary.js';

// Use `const` for constants and `let` for variables that change
const dictionary = realDictionary;
const date = new Date();
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6).fill().map(() => Array(5).fill('')),
  colors: Array(6).fill().map(() => Array(5).fill(0)),
  currentRow: 0,
  currentCol: 0,
};

const animationDuration = 500; // ms for animation timing

// Function to create and display the grid
function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  // Create grid boxes
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      drawBox(grid, row, col);
    }
  }

  container.appendChild(grid);
}

// Function to update grid based on the state
function updateGrid() {
  state.grid.forEach((row, i) => {
    row.forEach((letter, j) => {
      const box = document.getElementById(`box${i}${j}`);
      if (box) box.textContent = letter;
    });
  });
}

// Function to draw a single box in the grid
function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;
  container.appendChild(box);
  return box;
}

// Function to handle keyboard input events
function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;

    if (key === 'Enter') {
      handleEnterKey();
    } else if (key === 'Backspace') {
      removeLetter();
      clearLocalStorage();
    } else if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

// Safe localStorage operations
function setLocalStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

function getLocalStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error("Local storage error:", e);
    return null;
  }
}

function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// Handles the enter key logic
function handleEnterKey() {
  if (state.currentCol === 5) {
    const word = getCurrentWord();
    if (isWordValid(word)) {
      const currentInputs = getLocalStorageItem('inputs');
      if (currentInputs) {
        setLocalStorageItem('inputs', currentInputs + " " + word);
      } else {
        setLocalStorageItem('inputs', word);
      }
      
      revealWord(word);
      state.currentRow++;
      state.currentCol = 0;
    } else {
      showAlert('Pa yon mo valab.');
    }
  }
}

// Enhanced alert function for better mobile experience
function showAlert(message) {
  // Create a custom alert for better mobile experience
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    text-align: center;
    font-size: 1.1rem;
    color: #333;
    max-width: 80%;
  `;
  alertDiv.textContent = message;
  
  document.body.appendChild(alertDiv);
  
  // Remove after 2 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 2000);
  
  // Also remove on click/tap
  alertDiv.addEventListener('click', () => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  });
}

// Retrieves the current word from the grid
function getCurrentWord() {
  return state.grid[state.currentRow].join('');
}

// Validates if the current word exists in the dictionary
function isWordValid(word) {
  return dictionary.includes(word);
}

// Handles adding a letter to the grid
function addLetter(letter) {
  if (state.currentCol < 5 && state.currentRow < 6) {
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  }
}

// Handles removing a letter from the grid
function removeLetter() {
  if (state.currentCol > 0) {
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
  }
}

// Check if a key is a valid letter
function isLetter(key) {
  return key.length === 1 && key.match(/[a-zèò]/i);
}

// Reveal the word after a guess and animate the result
function revealWord(guess) {
  const row = state.currentRow;
  const c = state.colors;

  state.grid[row].forEach((letter, i) => {
    const box = document.getElementById(`box${row}${i}`);
    
    // Determine color for each letter
    if (letter === state.secret[i]) {
      const currentColoring = getLocalStorageItem('coloring');
      if (currentColoring) {
        setLocalStorageItem('coloring', currentColoring + '0');
      } else {
        setLocalStorageItem('coloring', '0');
      }
      c[row][i] = 0; // green
    } else if (state.secret.includes(letter)) {
      const currentColoring = getLocalStorageItem('coloring');
      if (currentColoring) {
        setLocalStorageItem('coloring', currentColoring + '1');
      } else {
        setLocalStorageItem('coloring', '1');
      }
      c[row][i] = 1; // yellow 
    } else {
      const currentColoring = getLocalStorageItem('coloring');
      if (currentColoring) {
        setLocalStorageItem('coloring', currentColoring + '2');
      } else {
        setLocalStorageItem('coloring', '2');
      }
      c[row][i] = 2; // gray 
    }
    
    setTimeout(() => {
      if (letter === state.secret[i]) {
        box.classList.add('right');
      } else if (state.secret.includes(letter)) {
        box.classList.add('wrong');
      } else {
        box.classList.add('empty');
      }
    }, (i + 1) * animationDuration / 2);
    
    box.classList.add('animated');
    box.style.animationDelay = `${i * animationDuration / 2}ms`;
  });
  
  const currentColoring = getLocalStorageItem('coloring');
  if (currentColoring) {
    setLocalStorageItem('coloring', currentColoring + " ");
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      openWinnerPopup();
    } else if (isGameOver) {
      showAlert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animationDuration);

  updateKeyboard();
}

function updateKeyboard() {
  const a = state.colors; // color values
  const row = state.currentRow; // row number 

  for (let i = 0; i < a[row].length; i++) {
    let letter = state.grid[row][i].toUpperCase(); // letter in word 
    if (!letter) continue; // Skip empty cells

    // letter color value (ex. 0 - green, 1 - yellow, 2 - gray)
    let color = state.colors[row][i];

    // button that corresponds to letter 
    const key = document.querySelector(`button[data-key="${letter}"]`);
    if (!key) continue; // Skip if key not found
  
    if (color === 0) {
      // Remove other classes and add green
      key.classList.remove('btn', 'btn1', 'btn2');
      key.classList.add('btn0'); 
    } else if (color === 1) {
      if (!key.classList.contains('btn0')) { // Only add if not green already
        key.classList.remove('btn', 'btn2');
        key.classList.add('btn1');
      }
    } else {
      if (!key.classList.contains('btn0') && !key.classList.contains('btn1')) { // Only add if not colored already
        key.classList.remove('btn');
        key.classList.add('btn2'); 
      }
    }
  }
}

// Utility functions to count occurrences
function getNumOfOccurrencesInWord(word, letter) {
  return word.split('').filter((char) => char === letter).length;
}

function getPositionOfOccurrence(word, letter, position) {
  let count = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      count++;
    }
  }
  return count;
}

// Winner popup
const winner = document.getElementById("winner-popup");
function openWinnerPopup() {
  document.getElementById("tries").innerHTML = "" + (state.currentRow + 1);
  winner.classList.add("open-popup");
}

// Initialize the game
function startup() {
  const game = document.getElementById('game');
  drawGrid(game);
  registerKeyboardEvents();
  
  // For debugging - comment out in production
  console.log("Secret word:", state.secret);
  // window.alert(state.secret); // Comment this out in production
  
  const savedInputs = getLocalStorageItem('inputs');
  if (savedInputs) {
    defaultGrid();
    reColor();
  }
}

function defaultGrid() {
  const inputs = getLocalStorageItem('inputs');
  if (!inputs) return;
  
  const words = inputs.split(" ");
  
  for (
