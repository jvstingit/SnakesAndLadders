














let players = ["Donald", "Nathan", "Justin"];
let current = 0;

function turn() {
  let currentPlayer = players[current];
  console.log(`It's ${currentPlayer}'s turn!`);
  
  current = (current + 1) % players.length;
}


element.addEventListener('click', turn);