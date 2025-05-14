document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const dice = document.getElementById('dice');
    const rollButton = document.getElementById('rollButton');
    const result = document.getElementById('result');
    const playerNameDisplay = document.getElementById('player-name');
    const dots = [...document.querySelectorAll('.dot')];
    
    // Players and game state
    const players = ['Donald', 'Nathan', 'Justin'];
    const playerColors = {
      'Donald': 'donald',
      'Nathan': 'nathan',
      'Justin': 'justin'
    };
    const playerPositions = {
      'Donald': 1,
      'Nathan': 1,
      'Justin': 1
    };
    let currentPlayerIndex = 0;
    
    // Snakes and Ladders
    const snakesAndLadders = {
      // Ladders: Bottom to Top
      4: 14,
      9: 31,
      20: 38,
      28: 84,
      40: 59,
      51: 67,
      63: 81,
      71: 91,
      
      // Snakes: Top to Bottom
      17: 7,
      54: 34,
      62: 19,
      64: 60,
      87: 24,
      93: 73,
      95: 75,
      99: 78
    };
    
    // Dice patterns for dots
    const dotPatterns = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    
    // Initialize the game
    function initializeGame() {
      updatePlayerPieces();
      updateCurrentPlayerDisplay();
      
      // Create snakes and ladders visual elements
      createSnakesAndLadders();
    }
    
    // Create visual elements for snakes and ladders
    function createSnakesAndLadders() {
      const board = document.querySelector('.board');
      
      // Create snakes and ladders visuals
      for (const [start, end] of Object.entries(snakesAndLadders)) {
        const startSquare = document.getElementById(`square-${start}`);
        const endSquare = document.getElementById(`square-${end}`);
        
        if (parseInt(start) < parseInt(end)) {
          // It's a ladder
          const ladder = document.createElement('div');
          ladder.className = 'ladder';
          ladder.style.borderLeft = '5px solid green';
          positionConnector(startSquare, endSquare, ladder);
          board.appendChild(ladder);
        } else {
          // It's a snake
          const snake = document.createElement('div');
          snake.className = 'snake';
          snake.style.borderLeft = '5px solid red';
          positionConnector(endSquare, startSquare, snake);
          board.appendChild(snake);
        }
      }
    }
    
    // Position connector (snake or ladder) between squares
    function positionConnector(from, to, element) {
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const boardRect = document.querySelector('.board').getBoundingClientRect();
      
      const fromCenter = {
        x: fromRect.left + fromRect.width / 2 - boardRect.left,
        y: fromRect.top + fromRect.height / 2 - boardRect.top
      };
      
      const toCenter = {
        x: toRect.left + toRect.width / 2 - boardRect.left,
        y: toRect.top + toRect.height / 2 - boardRect.top
      };
      
      const length = Math.sqrt(
        Math.pow(toCenter.x - fromCenter.x, 2) + 
        Math.pow(toCenter.y - fromCenter.y, 2)
      );
      
      const angle = Math.atan2(
        toCenter.y - fromCenter.y,
        toCenter.x - fromCenter.x
      ) * 180 / Math.PI;
      
      element.style.width = `${length}px`;
      element.style.height = '0';
      element.style.top = `${fromCenter.y}px`;
      element.style.left = `${fromCenter.x}px`;
      element.style.transformOrigin = '0 0';
      element.style.transform = `rotate(${angle}deg)`;
    }
    
    // Update the position of player pieces on the board
    function updatePlayerPieces() {
      // Remove existing player pieces
      document.querySelectorAll('.player-piece').forEach(piece => piece.remove());
      
      // Add player pieces at their current positions
      for (const player of players) {
        const position = playerPositions[player];
        const square = document.getElementById(`square-${position}`);
        
        if (square) {
          const playerPiece = document.createElement('div');
          playerPiece.className = `player-piece ${playerColors[player]}`;
          square.appendChild(playerPiece);
          
          // Update position display
          document.getElementById(`${player.toLowerCase()}-position`).textContent = position;
        }
      }
    }
    
    // Update current player display
    function updateCurrentPlayerDisplay() {
      const currentPlayer = players[currentPlayerIndex];
      playerNameDisplay.textContent = currentPlayer;
      playerNameDisplay.className = playerColors[currentPlayer];
    }
    
    // Roll the dice
    function rollDice() {
      const currentPlayer = players[currentPlayerIndex];
      const roll = Math.floor(Math.random() * 6) + 1;
      
      // Update dice visual
      dots.forEach(dot => dot.classList.remove('visible'));
      dotPatterns[roll].forEach(i => dots[i].classList.add('visible'));
      
      // Update result text
      result.textContent = `${currentPlayer} rolled a ${roll}`;
      
      // Move player
      movePlayer(currentPlayer, roll);
      
      // Check for win
      if (playerPositions[currentPlayer] >= 100) {
        playerPositions[currentPlayer] = 100; // Cap at 100
        updatePlayerPieces();
        result.textContent = `${currentPlayer} wins!`;
        rollButton.disabled = true;
        return;
      }
      
      // Next player's turn
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      updateCurrentPlayerDisplay();
    }
    
    // Move player based on dice roll
    function movePlayer(player, spaces) {
      let newPosition = playerPositions[player] + spaces;
      
      // Cap at 100 (player needs exact roll to win)
      if (newPosition > 100) {
        newPosition = playerPositions[player]; // Stay in place if overshooting
        result.textContent += " - Need exact roll to win!";
      }
      
      // Check for snakes and ladders
      if (snakesAndLadders[newPosition]) {
        const oldPosition = newPosition;
        newPosition = snakesAndLadders[newPosition];
        
        if (oldPosition < newPosition) {
          result.textContent += ` - Climbed a ladder to ${newPosition}!`;
        } else {
          result.textContent += ` - Slid down a snake to ${newPosition}!`;
        }
      }
      
      // Update player position
      playerPositions[player] = newPosition;
      updatePlayerPieces();
    }
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
    
    // Initialize the game
    initializeGame();
  });