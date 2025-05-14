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
    let isAnimating = false; // Flag to prevent multiple rolls during animation
    
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
    
    // Keep track of snake heads, tails, ladder starts and ends for coloring
    const ladderStarts = [4, 9, 20, 28, 40, 51, 63, 71];
    const ladderEnds = [14, 31, 38, 84, 59, 67, 81, 91];
    const snakeHeads = [17, 54, 62, 64, 87, 93, 95, 99];
    const snakeTails = [7, 34, 19, 60, 24, 73, 75, 78];
    
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
      colorSpecialTiles();
      updatePlayerPieces();
      updateCurrentPlayerDisplay();
      
      // Create snakes and ladders visual elements
      createSnakesAndLadders();
      
      // Create a legend for special tiles
      createLegend();
    }
    
    // Color special tiles (ladder starts/ends and snake heads/tails)
    function colorSpecialTiles() {
      // Color ladder start tiles
      ladderStarts.forEach(position => {
        const square = document.getElementById(`square-${position}`);
        if (square) {
          square.classList.add('ladder-start');
          
          // Remove default odd/even classes to avoid style conflicts
          square.classList.remove('square-odd', 'square-even');
        }
      });
      
      // Color ladder end tiles
      ladderEnds.forEach(position => {
        const square = document.getElementById(`square-${position}`);
        if (square) {
          square.classList.add('ladder-end');
          
          // Remove default odd/even classes to avoid style conflicts
          square.classList.remove('square-odd', 'square-even');
        }
      });
      
      // Color snake head tiles
      snakeHeads.forEach(position => {
        const square = document.getElementById(`square-${position}`);
        if (square) {
          square.classList.add('snake-head');
          
          // Remove default odd/even classes to avoid style conflicts
          square.classList.remove('square-odd', 'square-even');
        }
      });
      
      // Color snake tail tiles
      snakeTails.forEach(position => {
        const square = document.getElementById(`square-${position}`);
        if (square) {
          square.classList.add('snake-tail');
          
          // Remove default odd/even classes to avoid style conflicts
          square.classList.remove('square-odd', 'square-even');
        }
      });
    }
    
    // Create legend for special tiles
    function createLegend() {
      const gameContainer = document.querySelector('.game-container');
      const legend = document.createElement('div');
      legend.className = 'legend';
      
      // Create legend items
      const legendItems = [
        { class: 'ladder-start-color', label: 'Ladder Start' },
        { class: 'ladder-end-color', label: 'Ladder End' },
        { class: 'snake-head-color', label: 'Snake Head' },
        { class: 'snake-tail-color', label: 'Snake Tail' }
      ];
      
      legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = `legend-color ${item.class}`;
        
        const label = document.createElement('span');
        label.textContent = item.label;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
      });
      
      gameContainer.appendChild(legend);
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
          positionConnector(startSquare, endSquare, ladder);
          board.appendChild(ladder);
        } else {
          // It's a snake
          const snake = document.createElement('div');
          snake.className = 'snake';
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
          playerPiece.id = `${player.toLowerCase()}-piece`;
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
    
    // Generate proper path order for movement
    function generatePathOrder() {
      const path = [];
      for (let row = 0; row < 10; row++) {
        if (row % 2 === 0) {
          // Even rows (counting from 0) go left to right
          for (let col = 0; col < 10; col++) {
            path.push(row * 10 + col + 1);
          }
        } else {
          // Odd rows go right to left
          for (let col = 9; col >= 0; col--) {
            path.push(row * 10 + col + 1);
          }
        }
      }
      return path;
    }
    
    // Store the path order globally
    const pathOrder = generatePathOrder();
    
    // Get the index in the path for a position
    function getPathIndex(position) {
      return pathOrder.indexOf(position);
    }
    
    // Get the position at a specific path index
    function getPositionFromPathIndex(index) {
      if (index < 0 || index >= pathOrder.length) return null;
      return pathOrder[index];
    }
    
    // Roll the dice
    function rollDice() {
      // Prevent rolling while animation is in progress
      if (isAnimating) {
        return;
      }
      
      isAnimating = true;
      rollButton.disabled = true;
      
      const currentPlayer = players[currentPlayerIndex];
      const roll = Math.floor(Math.random() * 6) + 1;
      
      // Update dice visual
      dots.forEach(dot => dot.classList.remove('visible'));
      dotPatterns[roll].forEach(i => dots[i].classList.add('visible'));
      
      // Update result text
      result.textContent = `${currentPlayer} rolled a ${roll}`;
      
      // Move player with animation
      movePlayerWithAnimation(currentPlayer, roll);
    }
    
    // Move player with animation
    function movePlayerWithAnimation(player, spaces) {
      const startPosition = playerPositions[player];
      const startPathIndex = getPathIndex(startPosition);
      let currentPathIndex = startPathIndex;
      let stepCount = 0;
      
      // Animation function to move one square at a time along the path
      function moveOneStep() {
        if (stepCount < spaces && currentPathIndex + 1 < pathOrder.length) {
          currentPathIndex++;
          const newPosition = getPositionFromPathIndex(currentPathIndex);
          
          // Update position without checking for snakes and ladders yet
          playerPositions[player] = newPosition;
          updatePlayerPieces();
          
          // Add movement effect
          const playerPiece = document.getElementById(`${player.toLowerCase()}-piece`);
          if (playerPiece) {
            playerPiece.classList.add('teleporting');
            setTimeout(() => {
              playerPiece.classList.remove('teleporting');
            }, 300);
          }
          
          stepCount++;
          setTimeout(moveOneStep, 400);
        } else {
          // Check if we exceeded 100
          if (currentPathIndex >= pathOrder.indexOf(100)) {
            // Move back to the previous position if overshot
            playerPositions[player] = startPosition;
            updatePlayerPieces();
            result.textContent += " - Need exact roll to win!";
            finishMove();
            return;
          }
          
          // Wait a little before checking for snakes and ladders
          setTimeout(() => {
            // Only check for snakes and ladders after completing ALL moves
            checkSnakesAndLadders(player, playerPositions[player]);
          }, 500);
        }
      }
      
      // Check for snakes and ladders
      function checkSnakesAndLadders(player, position) {
        if (snakesAndLadders[position]) {
          const oldPosition = position;
          const newPosition = snakesAndLadders[position];
          
          // Pause briefly before teleporting
          setTimeout(() => {
            // Apply teleporting animation class
            const playerPiece = document.getElementById(`${player.toLowerCase()}-piece`);
            if (playerPiece) {
              playerPiece.classList.add('teleporting');
            }
            
            // Update position after a short delay for visual effect
            setTimeout(() => {
              playerPositions[player] = newPosition;
              updatePlayerPieces();
              
              if (oldPosition < newPosition) {
                result.textContent += ` - Climbed a ladder to ${newPosition}!`;
              } else {
                result.textContent += ` - Slid down a snake to ${newPosition}!`;
              }
              
              finishMove();
            }, 500);
          }, 700);
        } else {
          finishMove();
        }
      }
      
      // Finish the move and prepare for the next player
      function finishMove() {
        // Check for win
        if (playerPositions[player] >= 100) {
          playerPositions[player] = 100; // Cap at 100
          updatePlayerPieces();
          result.textContent = `${player} wins!`;
          isAnimating = false;
          return;
        }
        
        // Next player's turn
        setTimeout(() => {
          currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
          updateCurrentPlayerDisplay();
          isAnimating = false;
          rollButton.disabled = false;
        }, 500);
      }
      
      // Start the movement animation
      moveOneStep();
    }
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
    
    // Initialize the game
    initializeGame();
  });