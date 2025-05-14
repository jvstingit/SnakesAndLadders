// Game configuration
const config = {
  minPlayers: 2,
  maxPlayers: 4,
  defaultPlayers: 3
};

// Game state
let gameState = {
  players: [
    { name: "Donald", position: 1, color: "donald" },
    { name: "Nathan", position: 1, color: "nathan" },
    { name: "Justin", position: 1, color: "justin" },
    { name: "Player 4", position: 1, color: "player4" },
  ],
  currentPlayerIndex: 0,
  gameStarted: false,
  snakesAndLadders: {
    // Ladders: key is start position, value is end position
    ladders: {
      4: 14,
      9: 31,
      20: 38,
      28: 84,
      40: 59,
      63: 81,
      71: 91
    },
    // Snakes: key is head position (higher number), value is tail position (lower number)
    snakes: {
      17: 7,
      54: 34,
      62: 19,
      64: 60,
      87: 24,
      93: 73,
      95: 75,
      99: 78
    }
  }
};

// DOM Elements
const boardElement = document.querySelector('.board');
const rollButton = document.getElementById('rollButton');
const resultElement = document.getElementById('result');
const currentPlayerElement = document.getElementById('player-name');
const diceElement = document.getElementById('dice');

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
  drawSnakesAndLadders();
  updateBoard();
  
  rollButton.addEventListener('click', playTurn);
});

// Show the main menu to configure the game
function showMainMenu() {
  // Create a modal dialog for the menu
  const modal = document.createElement('div');
  modal.className = 'menu-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';

  // Create the menu content
  const menuContent = document.createElement('div');
  menuContent.style.backgroundColor = '#fff';
  menuContent.style.padding = '30px';
  menuContent.style.borderRadius = '10px';
  menuContent.style.maxWidth = '500px';
  menuContent.style.width = '90%';
  menuContent.style.textAlign = 'center';

  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Snakes and Ladders';
  title.style.color = '#292359';
  title.style.marginBottom = '20px';
  menuContent.appendChild(title);

  // Add player count selection
  const playerCountLabel = document.createElement('label');
  playerCountLabel.textContent = 'Number of Players: ';
  playerCountLabel.style.fontSize = '18px';
  menuContent.appendChild(playerCountLabel);

  const playerCountSelect = document.createElement('select');
  playerCountSelect.id = 'player-count';
  playerCountSelect.style.fontSize = '16px';
  playerCountSelect.style.padding = '5px';
  playerCountSelect.style.margin = '10px';
  
  for (let i = config.minPlayers; i <= config.maxPlayers; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === config.defaultPlayers) {
      option.selected = true;
    }
    playerCountSelect.appendChild(option);
  }
  menuContent.appendChild(playerCountSelect);
  
  menuContent.appendChild(document.createElement('br'));

  // Player name inputs section
  const playerInputsContainer = document.createElement('div');
  playerInputsContainer.id = 'player-inputs';
  playerInputsContainer.style.margin = '20px 0';
  
  // Create initial player inputs
  updatePlayerInputs(playerInputsContainer, config.defaultPlayers);
  
  // Update player inputs when player count changes
  playerCountSelect.addEventListener('change', () => {
    const count = parseInt(playerCountSelect.value);
    updatePlayerInputs(playerInputsContainer, count);
  });
  
  menuContent.appendChild(playerInputsContainer);

  // Add start button
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Game';
  startButton.style.padding = '10px 20px';
  startButton.style.fontSize = '16px';
  startButton.style.backgroundColor = '#4CAF50';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '5px';
  startButton.style.cursor = 'pointer';
  startButton.style.marginTop = '20px';
  
  startButton.addEventListener('click', () => {
    const playerCount = parseInt(playerCountSelect.value);
    const players = [];
    
    const colors = ['donald', 'nathan', 'justin', 'four'];
    
    for (let i = 0; i < playerCount; i++) {
      const nameInput = document.getElementById(`player-name-${i}`);
      let playerName = nameInput.value.trim();
      
      // Use default name if empty
      if (!playerName) {
        playerName = i === 0 ? 'Donald' : 
                    i === 1 ? 'Nathan' : 
                    i === 2 ? 'Justin' : 'Four';
      }
      
      players.push({
        name: playerName,
        position: 1,
        color: colors[i]
      });
    }
    
    // Update game state
    gameState.players = players;
    gameState.currentPlayerIndex = 0;
    gameState.gameStarted = true;
    
    // Remove modal
    document.body.removeChild(modal);
    
    // Update game UI
    updatePlayersInfo();
    updateCurrentPlayer();
    updateBoard();
  });
  
  menuContent.appendChild(startButton);
  modal.appendChild(menuContent);
  document.body.appendChild(modal);
}

// Update player input fields based on selected player count
function updatePlayerInputs(container, count) {
  // Clear existing inputs
  container.innerHTML = '';
  
  // Create input for each player
  for (let i = 0; i < count; i++) {
    const playerLabel = document.createElement('label');
    playerLabel.textContent = `Player ${i+1} Name: `;
    playerLabel.style.display = 'block';
    playerLabel.style.margin = '10px 0';
    
    const playerInput = document.createElement('input');
    playerInput.type = 'text';
    playerInput.id = `player-name-${i}`;
    playerInput.style.padding = '5px';
    playerInput.style.fontSize = '16px';
    playerInput.style.width = '200px';
    
    // Set default names
    if (i === 0) playerInput.value = 'Donald';
    else if (i === 1) playerInput.value = 'Nathan';
    else if (i === 2) playerInput.value = 'Justin';
    else playerInput.value = `Player ${i+1}`;
    
    playerLabel.appendChild(playerInput);
    container.appendChild(playerLabel);
  }
}

// Update the players info section in the UI
function updatePlayersInfo() {
  const playersInfoContainer = document.querySelector('.players-info');
  playersInfoContainer.innerHTML = '';
  
  gameState.players.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.id = `player-${player.name}`;
    
    const tokenDiv = document.createElement('div');
    tokenDiv.className = `player-token ${player.color}`;
    
    const spanElement = document.createElement('span');
    spanElement.innerHTML = `${player.name}: <span id="${player.name.toLowerCase()}-position">${player.position}</span>`;
    
    playerDiv.appendChild(tokenDiv);
    playerDiv.appendChild(spanElement);
    playersInfoContainer.appendChild(playerDiv);
  });
}

// Update the display of the current player
function updateCurrentPlayer() {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const playerNameElement = document.getElementById('player-name');
  
  // Remove all color classes
  playerNameElement.className = '';
  
  // Set current player's name and color
  playerNameElement.textContent = currentPlayer.name;
  playerNameElement.classList.add(currentPlayer.color);
}

// Draw snakes and ladders on the board
function drawSnakesAndLadders() {
  // Apply ladder start and end styling
  Object.entries(gameState.snakesAndLadders.ladders).forEach(([start, end]) => {
    const startSquare = document.getElementById(`square-${start}`);
    const endSquare = document.getElementById(`square-${end}`);
    
    if (startSquare && endSquare) {
      startSquare.classList.add('ladder-start');
      endSquare.classList.add('ladder-end');
      
      // Create visual ladder
      createLadder(parseInt(start), parseInt(end));
    }
  });
  
  // Apply snake head and tail styling
  Object.entries(gameState.snakesAndLadders.snakes).forEach(([head, tail]) => {
    const headSquare = document.getElementById(`square-${head}`);
    const tailSquare = document.getElementById(`square-${tail}`);
    
    if (headSquare && tailSquare) {
      headSquare.classList.add('snake-head');
      tailSquare.classList.add('snake-tail');
      
      // Create visual snake
      createSnake(parseInt(head), parseInt(tail));
    }
  });
}

// Create visual ladder between two squares
function createLadder(start, end) {
  const startSquare = document.getElementById(`square-${start}`);
  const endSquare = document.getElementById(`square-${end}`);
  
  if (!startSquare || !endSquare) return;
  
  const ladder = document.createElement('div');
  ladder.className = 'ladder';
  
  const startRect = startSquare.getBoundingClientRect();
  const endRect = endSquare.getBoundingClientRect();
  const boardRect = boardElement.getBoundingClientRect();
  
  // Calculate relative positions
  const startLeft = startRect.left - boardRect.left + (startRect.width / 2);
  const startTop = startRect.top - boardRect.top + (startRect.height / 2);
  const endLeft = endRect.left - boardRect.left + (endRect.width / 2);
  const endTop = endRect.top - boardRect.top + (endRect.height / 2);
  
  // Calculate length and angle
  const dx = endLeft - startLeft;
  const dy = endTop - startTop;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Position ladder
  ladder.style.width = `${length}px`;
  ladder.style.height = '10px';
  ladder.style.left = `${startLeft}px`;
  ladder.style.top = `${startTop}px`;
  ladder.style.transformOrigin = '0 50%';
  ladder.style.transform = `rotate(${angle}deg)`;
  
  boardElement.appendChild(ladder);
}

// Create visual snake between two squares
function createSnake(head, tail) {
  const headSquare = document.getElementById(`square-${head}`);
  const tailSquare = document.getElementById(`square-${tail}`);
  
  if (!headSquare || !tailSquare) return;
  
  const snake = document.createElement('div');
  snake.className = 'snake';
  
  const headRect = headSquare.getBoundingClientRect();
  const tailRect = tailSquare.getBoundingClientRect();
  const boardRect = boardElement.getBoundingClientRect();
  
  // Calculate relative positions
  const headLeft = headRect.left - boardRect.left + (headRect.width / 2);
  const headTop = headRect.top - boardRect.top + (headRect.height / 2);
  const tailLeft = tailRect.left - boardRect.left + (tailRect.width / 2);
  const tailTop = tailRect.top - boardRect.top + (tailRect.height / 2);
  
  // Calculate length and angle
  const dx = tailLeft - headLeft;
  const dy = tailTop - headTop;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Position snake
  snake.style.width = `${length}px`;
  snake.style.height = '10px';
  snake.style.left = `${headLeft}px`;
  snake.style.top = `${headTop}px`;
  snake.style.transformOrigin = '0 50%';
  snake.style.transform = `rotate(${angle}deg)`;
  
  boardElement.appendChild(snake);
}

// Play a turn when roll button is clicked
function playTurn() {
  if (!gameState.gameStarted) return;
  
  // Disable the roll button to prevent multiple clicks during a turn
  rollButton.disabled = true;
  
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  // Roll the dice
  const diceResult = rollDice();
  
  // Update position
  let newPosition = currentPlayer.position + diceResult;
  
  // Check if player won
  if (newPosition > 100) {
    // If roll exceeds 100, player bounces back
    newPosition = 100 - (newPosition - 100);
  }
  
  // Update result text
  resultElement.textContent = `${currentPlayer.name} rolled ${diceResult}! Moved from ${currentPlayer.position} to ${newPosition}`;

  // Move the player on the board
  movePlayer(currentPlayer, newPosition);
  
  // Check for snakes and ladders
  setTimeout(() => {
    checkSnakesAndLadders(currentPlayer);
  }, 600);
}

// Roll the dice and update the dice UI
function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  updateDiceVisual(result);
  return result;
}

// Update the visual display of the dice
function updateDiceVisual(value) {
  // Hide all dots first
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => dot.classList.remove('visible'));
  
  // Show the appropriate dots based on the dice value
  switch (value) {
    case 1:
      document.getElementById('dot4').classList.add('visible');
      break;
    case 2:
      document.getElementById('dot0').classList.add('visible');
      document.getElementById('dot8').classList.add('visible');
      break;
    case 3:
      document.getElementById('dot0').classList.add('visible');
      document.getElementById('dot4').classList.add('visible');
      document.getElementById('dot8').classList.add('visible');
      break;
    case 4:
      document.getElementById('dot0').classList.add('visible');
      document.getElementById('dot2').classList.add('visible');
      document.getElementById('dot6').classList.add('visible');
      document.getElementById('dot8').classList.add('visible');
      break;
    case 5:
      document.getElementById('dot0').classList.add('visible');
      document.getElementById('dot2').classList.add('visible');
      document.getElementById('dot4').classList.add('visible');
      document.getElementById('dot6').classList.add('visible');
      document.getElementById('dot8').classList.add('visible');
      break;
    case 6:
      document.getElementById('dot0').classList.add('visible');
      document.getElementById('dot2').classList.add('visible');
      document.getElementById('dot3').classList.add('visible');
      document.getElementById('dot5').classList.add('visible');
      document.getElementById('dot6').classList.add('visible');
      document.getElementById('dot8').classList.add('visible');
      break;
  }
}

// Move player to a new position
function movePlayer(player, newPosition) {
  // Update player position in game state
  player.position = newPosition;
  
  // Update position display
  const positionElement = document.getElementById(`${player.name.toLowerCase()}-position`);
  if (positionElement) {
    positionElement.textContent = newPosition;
  }
  
  // Update board
  updateBoard();
  
  // Check if player won
  if (newPosition === 100) {
    setTimeout(() => {
      alert(`${player.name} has won the game!`);
      resetGame();
    }, 1000);
    return true; // Return true to indicate the game ended
  }
  
  return false; // Return false to indicate the game continues
}

// Check if player landed on a snake or ladder
function checkSnakesAndLadders(player) {
  const position = player.position;
  let newPosition = position;
  let gameEnded = false;
  
  // Check ladders
  if (gameState.snakesAndLadders.ladders[position]) {
    newPosition = gameState.snakesAndLadders.ladders[position];
    resultElement.textContent += ` -> Climbed a ladder to ${newPosition}!`;
  }
  
  // Check snakes
  if (gameState.snakesAndLadders.snakes[position]) {
    newPosition = gameState.snakesAndLadders.snakes[position];
    resultElement.textContent += ` -> Slid down a snake to ${newPosition}!`;
  }
  
  // If position changed, update player position
  if (newPosition !== position) {
    const playerPiece = document.querySelector(`.player-piece.${player.color}`);
    if (playerPiece) {
      playerPiece.classList.add('teleporting');
      setTimeout(() => {
        playerPiece.classList.remove('teleporting');
      }, 600);
    }
    
    // Move player to new position (and check if they won)
    gameEnded = movePlayer(player, newPosition);
  }
  
  // If the game didn't end, move to next player after a delay to allow animations to complete
  if (!gameEnded) {
    setTimeout(() => {
      nextPlayer();
      // Re-enable the roll button
      rollButton.disabled = false;
    }, 600);
  }
}

// Move to the next player's turn
function nextPlayer() {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  updateCurrentPlayer();
}

// Update the board display
function updateBoard() {
  // Remove all existing player pieces
  const existingPieces = document.querySelectorAll('.player-piece');
  existingPieces.forEach(piece => {
    if (piece.parentNode) {
      piece.parentNode.removeChild(piece);
    }
  });
  
  // Add player pieces to their current positions
  gameState.players.forEach(player => {
    const square = document.getElementById(`square-${player.position}`);
    if (square) {
      const playerPiece = document.createElement('div');
      playerPiece.className = `player-piece ${player.color}`;
      square.appendChild(playerPiece);
    }
  });
}

// Reset the game
function resetGame() {
  // Reset player positions
  gameState.players.forEach(player => {
    player.position = 1;
  });
  
  // Reset current player
  gameState.currentPlayerIndex = 0;
  
  // Show main menu again
  showMainMenu();
  
  // Update UI
  updateCurrentPlayer();
  updateBoard();
  resultElement.textContent = '';
  
  // Re-enable roll button
  rollButton.disabled = false;
}