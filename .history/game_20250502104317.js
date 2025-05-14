// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const dice = document.getElementById('dice');
const rollButton = document.getElementById('rollButton');
const result = document.getElementById('result');
const positionDisplay = document.getElementById('position');
const dots = [...document.querySelectorAll('.dot')];

// Game Constants
const BOARD_SIZE = 10;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;

// Game State
let playerPosition = 1;
let isMoving = false;

// Dice dot patterns
const dotPatterns = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// Special tiles: red (snakes) and green (ladders)
// Format: { tileNumber: destinationTileNumber }
const redTiles = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78
};

const greenTiles = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};

// Initialize the game board
function initializeBoard() {
  // Create the tiles in a snake pattern (1 starts bottom left, moving right then up)
  for (let row = BOARD_SIZE - 1; row >= 0; row--) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Calculate the tile number based on the snake pattern
      let tileNumber;
      if ((BOARD_SIZE - row) % 2 === 1) {
        // Odd rows (from the bottom) go left to right
        tileNumber = (BOARD_SIZE - row - 1) * BOARD_SIZE + col + 1;
      } else {
        // Even rows (from the bottom) go right to left
        tileNumber = (BOARD_SIZE - row) * BOARD_SIZE - col;
      }

      // Create the tile element
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.id = `tile-${tileNumber}`;
      tile.textContent = tileNumber;

      // Add special tile classes and effects
      if (redTiles[tileNumber]) {
        tile.classList.add('red');
        const effect = document.createElement('div');
        effect.classList.add('effect');
        tile.appendChild(effect);
      } else if (greenTiles[tileNumber]) {
        tile.classList.add('green');
        const effect = document.createElement('div');
        effect.classList.add('effect');
        tile.appendChild(effect);
      }

      gameBoard.appendChild(tile);
    }
  }

  // Create player marker
  const player = document.createElement('div');
  player.classList.add('player');
  player.id = 'player';

  // Place player on the first tile
  const startTile = document.getElementById('tile-1');
  startTile.appendChild(player);
}

// Roll the dice and move the player
function rollDice() {
  if (isMoving) return;

  // Roll the dice
  const roll = Math.floor(Math.random() * 6) + 1;
  
  // Update dice display
  dots.forEach(dot => dot.classList.remove('visible'));
  dotPatterns[roll].forEach(i => dots[i].classList.add('visible'));
  
  // Show roll result
  result.textContent = `You rolled a ${roll}`;
  
  // Calculate the new position
  let newPosition = playerPosition + roll;
  
  // Check if player wins
  if (newPosition > TOTAL_TILES) {
    result.textContent = `You rolled a ${roll}, but you need to land exactly on 100 to win!`;
    return;
  }
  
  // Move the player
  movePlayer(newPosition);
}

// Move the player to a new position with animation
function movePlayer(newPosition) {
  isMoving = true;
  rollButton.disabled = true;
  
  // Move step by step for animation effect
  const moveStep = () => {
    // Remove player from current tile
    const currentTile = document.getElementById(`tile-${playerPosition}`);
    const player = document.getElementById('player');
    currentTile.removeChild(player);
    
    // Increment position
    playerPosition++;
    
    // Place player on the new tile
    const nextTile = document.getElementById(`tile-${playerPosition}`);
    nextTile.appendChild(player);
    
    // Update position display
    positionDisplay.textContent = `You are at position: ${playerPosition}`;
    
    // Continue moving if not reached the target position
    if (playerPosition < newPosition) {
      setTimeout(moveStep, 300);
    } else {
      // Check for special tiles
      checkSpecialTiles();
    }
  };
  
  moveStep();
}

// Check if the player landed on a special tile
function checkSpecialTiles() {
  // Check if player is on a red tile (snake)
  if (redTiles[playerPosition]) {
    setTimeout(() => {
      result.textContent = `Oh no! You landed on a red tile and slid back to ${redTiles[playerPosition]}!`;
      movePlayerDirectly(redTiles[playerPosition]);
    }, 500);
  } 
  // Check if player is on a green tile (ladder)
  else if (greenTiles[playerPosition]) {
    setTimeout(() => {
      result.textContent = `Great! You landed on a green tile and moved forward to ${greenTiles[playerPosition]}!`;
      movePlayerDirectly(greenTiles[playerPosition]);
    }, 500);
  }
  // Check if player won
  else if (playerPosition === TOTAL_TILES) {
    result.textContent = `Congratulations! You reached tile ${TOTAL_TILES} and won the game!`;
    rollButton.disabled = true;
    isMoving = false;
  } else {
    isMoving = false;
    rollButton.disabled = false;
  }
}

// Move player directly to a position without animation
function movePlayerDirectly(position) {
  // Remove player from current tile
  const currentTile = document.getElementById(`tile-${playerPosition}`);
  const player = document.getElementById('player');
  currentTile.removeChild(player);
  
  // Set new position
  playerPosition = position;
  
  // Place player on the new tile
  const nextTile = document.getElementById(`tile-${playerPosition}`);
  nextTile.appendChild(player);
  
  // Update position display
  positionDisplay.textContent = `You are at position: ${playerPosition}`;
  
  // Check if player won
  if (playerPosition === TOTAL_TILES) {
    result.textContent = `Congratulations! You reached tile ${TOTAL_TILES} and won the game!`;
    rollButton.disabled = true;
  } else {
    isMoving = false;
    rollButton.disabled = false;
  }
}

// Event listeners
rollButton.addEventListener('click', rollDice);

// Initialize the game
initializeBoard();