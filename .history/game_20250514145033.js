const config = {
  minPlayers: 2,
  maxPlayers: 4,
  defaultPlayers: 3
};


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

    ladders: {
      4: 14,
      9: 31,
      20: 38,
      28: 84,
      40: 59,
      63: 81,
      71: 91
    },

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


const boardElement = document.querySelector('.board');
const rollButton = document.getElementById('rollButton');
const resultElement = document.getElementById('result');
const currentPlayerElement = document.getElementById('player-name');
const diceElement = document.getElementById('dice');

document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
  drawSnakesAndLadders();
  updateBoard();
  
  rollButton.addEventListener('click', playTurn);
});


function showMainMenu() {

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

  const menuContent = document.createElement('div');
  menuContent.style.backgroundColor = '#fff';
  menuContent.style.padding = '30px';
  menuContent.style.borderRadius = '10px';
  menuContent.style.maxWidth = '500px';
  menuContent.style.width = '90%';
  menuContent.style.textAlign = 'center';

  const title = document.createElement('h2');
  title.textContent = 'Snakes and Ladders';
  title.style.color = '#292359';
  title.style.marginBottom = '20px';
  menuContent.appendChild(title);

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


  const playerInputsContainer = document.createElement('div');
  playerInputsContainer.id = 'player-inputs';
  playerInputsContainer.style.margin = '20px 0';
  

  updatePlayerInputs(playerInputsContainer, config.defaultPlayers);
  

  playerCountSelect.addEventListener('change', () => {
    const count = parseInt(playerCountSelect.value);
    updatePlayerInputs(playerInputsContainer, count);
  });
  
  menuContent.appendChild(playerInputsContainer);


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

    gameState.currentPlayerIndex = 0;
    gameState.gameStarted = true;
    

    document.body.removeChild(modal);
    

    updatePlayersInfo();
    updateCurrentPlayer();
    updateBoard();
  });
  
  menuContent.appendChild(startButton);
  modal.appendChild(menuContent);
  document.body.appendChild(modal);
}

function updatePlayerInputs(container, count) {

  container.innerHTML = '';
  

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

    if (i === 0) playerInput.value = 'Donald';
    else if (i === 1) playerInput.value = 'Nathan';
    else if (i === 2) playerInput.value = 'Justin';
    else playerInput.value = `Player ${i+1}`;
    
    playerLabel.appendChild(playerInput);
    container.appendChild(playerLabel);
  }
}

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

function updateCurrentPlayer() {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const playerNameElement = document.getElementById('player-name');

  playerNameElement.className = '';
  

  playerNameElement.textContent = currentPlayer.name;
  playerNameElement.classList.add(currentPlayer.color);
}


function drawSnakesAndLadders() {

  Object.entries(gameState.snakesAndLadders.ladders).forEach(([start, end]) => {
    const startSquare = document.getElementById(`square-${start}`);
    const endSquare = document.getElementById(`square-${end}`);
    
    if (startSquare && endSquare) {
      startSquare.classList.add('ladder-start');
      endSquare.classList.add('ladder-end');
      

      createLadder(parseInt(start), parseInt(end));
    }
  });
  

  Object.entries(gameState.snakesAndLadders.snakes).forEach(([head, tail]) => {
    const headSquare = document.getElementById(`square-${head}`);
    const tailSquare = document.getElementById(`square-${tail}`);
    
    if (headSquare && tailSquare) {
      headSquare.classList.add('snake-head');
      tailSquare.classList.add('snake-tail');

      createSnake(parseInt(head), parseInt(tail));
    }
  });
}

function createLadder(start, end) {
  const startSquare = document.getElementById(`square-${start}`);
  const endSquare = document.getElementById(`square-${end}`);
  
  if (!startSquare || !endSquare) return;
  
  const ladder = document.createElement('div');
  ladder.className = 'ladder';
  
  const startRect = startSquare.getBoundingClientRect();
  const endRect = endSquare.getBoundingClientRect();
  const boardRect = boardElement.getBoundingClientRect();
  

  const startLeft = startRect.left - boardRect.left + (startRect.width / 2);
  const startTop = startRect.top - boardRect.top + (startRect.height / 2);
  const endLeft = endRect.left - boardRect.left + (endRect.width / 2);
  const endTop = endRect.top - boardRect.top + (endRect.height / 2);

  const dx = endLeft - startLeft;
  const dy = endTop - startTop;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  ladder.style.width = `${length}px`;
  ladder.style.height = '10px';
  ladder.style.left = `${startLeft}px`;
  ladder.style.top = `${startTop}px`;
  ladder.style.transformOrigin = '0 50%';
  ladder.style.transform = `rotate(${angle}deg)`;
  
  boardElement.appendChild(ladder);
}


function createSnake(head, tail) {
  const headSquare = document.getElementById(`square-${head}`);
  const tailSquare = document.getElementById(`square-${tail}`);
  
  if (!headSquare || !tailSquare) return;
  
  const snake = document.createElement('div');
  snake.className = 'snake';
  
  const headRect = headSquare.getBoundingClientRect();
  const tailRect = tailSquare.getBoundingClientRect();
  const boardRect = boardElement.getBoundingClientRect();
  

  const headLeft = headRect.left - boardRect.left + (headRect.width / 2);
  const headTop = headRect.top - boardRect.top + (headRect.height / 2);
  const tailLeft = tailRect.left - boardRect.left + (tailRect.width / 2);
  const tailTop = tailRect.top - boardRect.top + (tailRect.height / 2);
  

  const dx = tailLeft - headLeft;
  const dy = tailTop - headTop;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  

  snake.style.width = `${length}px`;
  snake.style.height = '10px';
  snake.style.left = `${headLeft}px`;
  snake.style.top = `${headTop}px`;
  snake.style.transformOrigin = '0 50%';
  snake.style.transform = `rotate(${angle}deg)`;
  
  boardElement.appendChild(snake);
}


function playTurn() {
  if (!gameState.gameStarted) return;
  

  rollButton.disabled = true;
  
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  

  const diceResult = rollDice();
  

  let newPosition = currentPlayer.position + diceResult;
  

  if (newPosition > 100) {

    newPosition = 100 - (newPosition - 100);
  }
  

  resultElement.textContent = `${currentPlayer.name} rolled ${diceResult}! Moved from ${currentPlayer.position} to ${newPosition}`;

  movePlayer(currentPlayer, newPosition);
  

  setTimeout(() => {
    checkSnakesAndLadders(currentPlayer);
  }, 600);
}


function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  updateDiceVisual(result);
  return result;
}


function updateDiceVisual(value) {

  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => dot.classList.remove('visible'));
  

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


function movePlayer(player, newPosition) {

  player.position = newPosition;

  const positionElement = document.getElementById(`${player.name.toLowerCase()}-position`);
  if (positionElement) {
    positionElement.textContent = newPosition;
  }

  updateBoard();

  if (newPosition === 100) {
    setTimeout(() => {
      alert(`${player.name} has won the game!`);
      resetGame();
    }, 1000);
    return true; 
  }
  
  return false; 
}


function checkSnakesAndLadders(player) {
  const position = player.position;
  let newPosition = position;
  let gameEnded = false;
  

  if (gameState.snakesAndLadders.ladders[position]) {
    newPosition = gameState.snakesAndLadders.ladders[position];
    resultElement.textContent += ` -> Climbed a ladder to ${newPosition}!`;
  }
  

  if (gameState.snakesAndLadders.snakes[position]) {
    newPosition = gameState.snakesAndLadders.snakes[position];
    resultElement.textContent += ` -> Slid down a snake to ${newPosition}!`;
  }
  

  if (newPosition !== position) {
    const playerPiece = document.querySelector(`.player-piece.${player.color}`);
    if (playerPiece) {
      playerPiece.classList.add('teleporting');
      setTimeout(() => {
        playerPiece.classList.remove('teleporting');
      }, 600);
    }

    gameEnded = movePlayer(player, newPosition);
  }

  if (!gameEnded) {
    setTimeout(() => {
      nextPlayer();
      rollButton.disabled = false;
    }, 600);
  }
}


function nextPlayer() {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  updateCurrentPlayer();
}

function updateBoard() {
  const existingPieces = document.querySelectorAll('.player-piece');
  existingPieces.forEach(piece => {
    if (piece.parentNode) {
      piece.parentNode.removeChild(piece);
    }
  });

  gameState.players.forEach(player => {
    const square = document.getElementById(`square-${player.position}`);
    if (square) {
      const playerPiece = document.createElement('div');
      playerPiece.className = `player-piece ${player.color}`;
      square.appendChild(playerPiece);
    }
  });
}

function resetGame() {

  gameState.players.forEach(player => {
    player.position = 1;
  });

  gameState.currentPlayerIndex = 0;

  showMainMenu();

  updateCurrentPlayer();
  updateBoard();
  resultElement.textContent = '';

  rollButton.disabled = false;
}