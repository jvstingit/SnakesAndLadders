var players = ['Donald', 'Nathan', 'Justin'];
var current = 0;

element.addEventListener('click', turn);

function turn() {
    var currentPlayer = players[current];
    console.log(`It's ${currentPlayer}'s turn!`);
    current = (current + 1) % players.length;
}
