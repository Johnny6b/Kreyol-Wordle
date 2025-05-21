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
      localStorage.clear();
    } else if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

// Handles the enter key logic
function handleEnterKey() {
  if (state.currentCol === 5) {
    const word = getCurrentWord();
    if (isWordValid(word)) {
      try {
        if(localStorage.getItem('inputs'))
          localStorage.setItem('inputs', localStorage.getItem('inputs') + " " + word);
        else 
          localStorage.setItem('inputs', word);
      } catch (e) {
        console.error("Local storage error:", e);
      }
      
      revealWord(word);
      state.currentRow++;
      state.currentCol = 0;
    } else {
      alert('Pa yon mo valab.');
    }
  }
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
    
    //number of times the inputted letter is in the answer
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(state.secret, letter);
    //number of times they have the inputted letter in their guess
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);

    const letterPosition = getPositionOfOccurrence(guess, letter, i);
    
    if (letter === state.secret[i]) {
      try {
        if(localStorage.getItem('coloring'))
          localStorage.setItem('coloring', localStorage.getItem('coloring') + '0');
        else
          localStorage.setItem('coloring', '0');
      } catch (e) {
        console.error("Local storage error:", e);
      }
      c[row][i] = 0;//green
    }
    else if (state.secret.includes(letter)) {
      try {
        if(localStorage.getItem('coloring'))
          localStorage.setItem('coloring', localStorage.getItem('coloring') + '1');
        else
          localStorage.setItem('coloring', '1');
      } catch (e) {
        console.error("Local storage error:", e);
      }
      c[row][i] = 1;//yellow 
    }
    else {
      try {
        if(localStorage.getItem('coloring'))
          localStorage.setItem('coloring', localStorage.getItem('coloring') + '2');
        else
          localStorage.setItem('coloring', '2');
      } catch (e) {
        console.error("Local storage error:", e);
      }
      c[row][i] = 2;//gray 
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
  
  try {
    localStorage.setItem('coloring', localStorage.getItem('coloring') + " ");
  } catch (e) {
    console.error("Local storage error:", e);
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      openPopup();
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animationDuration);

  updateKeyboard();
}

function updateKeyboard(){
  const a = state.colors;//color values
  const row = state.currentRow;//row number 

  for(let i = 0; i < a[row].length; i++) {
    let letter = state.grid[row][i].toUpperCase();//letter in word 
    if (!letter) continue; // Skip empty cells

    //letter color value (ex. 0 - green, 1 - yellow, 2 - gray)
    let color = state.colors[row][i];

    //button that corresponds to letter 
    const key = document.querySelector(`button[data-key="${letter}"]`);
    if (!key) continue; // Skip if key not found
  
    if(color === 0){
      if(key.classList.contains('btn1'))
        key.classList.remove('btn1');
      else if(key.classList.contains('btn'))
        key.classList.remove('btn');
      if(key.classList.contains('btn2'))
        key.classList.remove('btn2');

      key.classList.add('btn0'); 
    }
    else if(color === 1){
      if(!key.classList.contains('btn0')) { // Only add if not green already
        if(key.classList.contains('btn'))
          key.classList.remove('btn');
        if(key.classList.contains('btn2'))
          key.classList.remove('btn2');
        key.classList.add('btn1');
      }
    }
    else {
      if(!key.classList.contains('btn0') && !key.classList.contains('btn1')) { // Only add if not colored already
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

//winner popup
const winner = document.getElementById("winner-popup");
function openPopup(){
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
  
  try {
    if (localStorage.getItem('inputs')) {
      defaultGrid();
      reColor();
    }
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

function defaultGrid() {
  try {
    const inputs = localStorage.getItem('inputs');
    if (!inputs) return;
    
    const words = inputs.split(" ");
    
    for(let i = 0; i < words.length; i++) {
      const letters = words[i].split("");
      for(let j = 0; j < letters.length; j++) {
        state.grid[i][j] = letters[j];
      }
    }
    state.currentRow = words.length;
    updateGrid();
  } catch (e) {
    console.error("Error loading saved game:", e);
  }
}

function reColor() {
  try {
    const coloring = localStorage.getItem('coloring');
    if (!coloring) return;
    
    const rcolors = coloring.split(" ");

    for(let i = 0; i < rcolors.length; i++) {
      if (!rcolors[i]) continue;
      
      const lcolors = rcolors[i].split("");

      for(let j = 0; j < lcolors.length; j++) {
        const box = document.getElementById(`box${i}${j}`);
        if (!box) continue;
        
        if (lcolors[j] === '0') {
          box.classList.add('right');
        } else if (lcolors[j] === '1') {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }
  } catch (e) {
    console.error("Error recoloring saved game:", e);
  }
}

// Event setup for keyboard
document.addEventListener('DOMContentLoaded', function() {
  //handles the keyboard buttons - letters
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      var guy = "" + btn.innerHTML;
      addLetter(guy.toLowerCase());
      updateGrid();
    });
  });

  //handles the keyboard buttons - Enter button
  const enter = document.querySelector('.Enter');
  if (enter) {
    enter.addEventListener('click', () => {
      handleEnterKey();
      updateGrid();
    });
  }

  //handles the keyboard buttons - delete button
  const Delete = document.querySelector('.delete');
  if (Delete) {
    Delete.addEventListener('click', () => {
      removeLetter();
      updateGrid();
    });
  }

  // Launch the game
  startup();
});

