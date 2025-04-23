const dice = document.getElementById('dice');
const result = document.getElementById('result');
const dots = [...document.querySelectorAll('.dot')];

const dotPatterns = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  dots.forEach(dot => dot.classList.remove('visible'));
  dotPatterns[roll].forEach(i => dots[i].classList.add('visible'));
  result.textContent = `You rolled a ${roll}`;
}

dice.addEventListener('click', rollDice);

// Roll once on load
rollDice();
