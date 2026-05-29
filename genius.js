document.addEventListener('DOMContentLoaded', () => {
  const colors = ['blue', 'green', 'red', 'yellow'];
  const sequence = [];
  let playerStep = 0;
  let round = 0;
  let acceptingInput = false;
  let gameOver = false;

  const startButton = document.getElementById('start-game');
  const restartButton = document.getElementById('restart-game');
  const roundDisplay = document.getElementById('round-count');
  const bestScoreDisplay = document.getElementById('best-score');
  const statusDisplay = document.getElementById('genius-status');
  const pads = Array.from(document.querySelectorAll('.genius-pad'));

  const messages = {
    ready: 'Clique em Come\u00e7ar jogo quando estiver pronto.',
    start: 'Observe a sequ\u00eancia com calma.',
    userTurn: 'Sua vez. Repita a sequ\u00eancia.',
    success: 'Excelente! Voc\u00ea est\u00e1 indo muito bem.',
    error: 'Tudo bem. Vamos tentar novamente com calma.'
  };

  let bestScore = Number(localStorage.getItem('geniusBestScore')) || 0;
  bestScoreDisplay.textContent = bestScore;

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', resetGame);
  pads.forEach((pad) => pad.addEventListener('click', handlePadClick));
  setPadsDisabled(true);

  function startGame() {
    sequence.length = 0;
    playerStep = 0;
    round = 0;
    gameOver = false;
    startButton.disabled = true;
    statusDisplay.classList.remove('error');
    nextRound();
  }

  function resetGame() {
    sequence.length = 0;
    playerStep = 0;
    round = 0;
    acceptingInput = false;
    gameOver = false;
    roundDisplay.textContent = '0';
    startButton.disabled = false;
    statusDisplay.classList.remove('error');
    statusDisplay.textContent = messages.ready;
    setPadsDisabled(true);
  }

  function nextRound() {
    acceptingInput = false;
    setPadsDisabled(true);
    playerStep = 0;
    round += 1;
    roundDisplay.textContent = round;
    sequence.push(getRandomColor());
    statusDisplay.classList.remove('error');
    statusDisplay.textContent = messages.start;

    setTimeout(playSequence, 900);
  }

  async function playSequence() {
    for (const color of sequence) {
      await lightPad(color);
      await wait(350);
    }

    acceptingInput = true;
    setPadsDisabled(false);
    statusDisplay.textContent = messages.userTurn;
  }

  function handlePadClick(event) {
    if (!acceptingInput || gameOver) return;

    const selectedColor = event.currentTarget.dataset.color;
    lightPad(selectedColor);

    if (selectedColor !== sequence[playerStep]) {
      endGame();
      return;
    }

    playerStep += 1;
    if (playerStep === sequence.length) {
      acceptingInput = false;
      setPadsDisabled(true);
      statusDisplay.classList.remove('error');
      statusDisplay.textContent = messages.success;
      updateBestScore();
      setTimeout(nextRound, 1200);
    }
  }

  function endGame() {
    gameOver = true;
    acceptingInput = false;
    setPadsDisabled(true);
    startButton.disabled = false;
    statusDisplay.classList.add('error');
    statusDisplay.textContent = messages.error;
    updateBestScore();
  }

  function updateBestScore() {
    const score = Math.max(0, round - (gameOver ? 1 : 0));
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('geniusBestScore', String(bestScore));
      bestScoreDisplay.textContent = bestScore;
    }
  }

  function lightPad(color) {
    const pad = pads.find((item) => item.dataset.color === color);
    if (!pad) return Promise.resolve();

    pad.classList.add('is-active');
    return wait(650).then(() => {
      pad.classList.remove('is-active');
    });
  }

  function setPadsDisabled(disabled) {
    pads.forEach((pad) => {
      pad.disabled = disabled;
    });
  }

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
});
