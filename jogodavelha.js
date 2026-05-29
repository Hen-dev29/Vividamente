document.addEventListener('DOMContentLoaded', () => {
  const human = 'X';
  const computer = 'O';
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const boardElement = document.getElementById('tic-board');
  const statusElement = document.getElementById('tic-status');
  const turnElement = document.getElementById('tic-turn-label');
  const newGameButton = document.getElementById('new-tic-game');
  const difficultySelect = document.getElementById('tic-difficulty');

  let board = Array(9).fill('');
  let active = true;
  let currentTurn = human;

  newGameButton.addEventListener('click', () => startGame('Nova partida iniciada. Boa sorte!'));
  difficultySelect.addEventListener('change', () => startGame('Nova partida iniciada. Boa sorte!'));
  startGame('Sua vez. Escolha uma casa.');

  function startGame(message) {
    board = Array(9).fill('');
    active = true;
    currentTurn = human;
    setStatus(message);
    updateTurn();
    renderBoard();
  }

  function renderBoard() {
    boardElement.innerHTML = '';

    board.forEach((value, index) => {
      const cell = document.createElement('button');
      cell.className = 'tic-cell';
      cell.type = 'button';
      cell.dataset.index = index;
      cell.textContent = value;
      cell.setAttribute('aria-label', value ? `Casa escolhida por ${value}` : `Casa vazia ${index + 1}`);

      if (value === human) cell.classList.add('x');
      if (value === computer) cell.classList.add('o');
      if (!active || value || currentTurn !== human) cell.disabled = true;

      cell.addEventListener('click', handlePlayerMove);
      boardElement.appendChild(cell);
    });
  }

  function handlePlayerMove(event) {
    const index = Number(event.currentTarget.dataset.index);

    if (!active || currentTurn !== human) return;
    if (board[index]) {
      setStatus('Essa casa j\u00e1 foi escolhida. Tente outra.', true);
      return;
    }

    board[index] = human;
    renderBoard();

    if (finishIfNeeded()) return;

    currentTurn = computer;
    updateTurn();
    setStatus('O computador est\u00e1 pensando.');
    renderBoard();
    window.setTimeout(makeComputerMove, 650);
  }

  function makeComputerMove() {
    if (!active) return;

    const difficulty = difficultySelect.value;
    let index;

    if (difficulty === 'easy') index = getRandomMove(board);
    if (difficulty === 'medium') index = getMediumMove();
    if (difficulty === 'hard') index = getBestMove(board);

    if (index === undefined || index === null) return;

    board[index] = computer;
    renderBoard();

    if (finishIfNeeded()) return;

    currentTurn = human;
    updateTurn();
    setStatus('Sua vez. Escolha uma casa.');
    renderBoard();
  }

  function getMediumMove() {
    return findWinningMove(board, computer) ??
      findWinningMove(board, human) ??
      getRandomMove(board);
  }

  function getBestMove(nextBoard) {
    let bestScore = -Infinity;
    let move = null;

    getEmptyIndexes(nextBoard).forEach((index) => {
      nextBoard[index] = computer;
      const score = minimax(nextBoard, false);
      nextBoard[index] = '';

      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    });

    return move;
  }

  function minimax(nextBoard, isComputerTurn) {
    const winner = getWinner(nextBoard);
    if (winner === computer) return 10;
    if (winner === human) return -10;
    if (isDraw(nextBoard)) return 0;

    if (isComputerTurn) {
      let bestScore = -Infinity;
      getEmptyIndexes(nextBoard).forEach((index) => {
        nextBoard[index] = computer;
        bestScore = Math.max(bestScore, minimax(nextBoard, false));
        nextBoard[index] = '';
      });
      return bestScore;
    }

    let bestScore = Infinity;
    getEmptyIndexes(nextBoard).forEach((index) => {
      nextBoard[index] = human;
      bestScore = Math.min(bestScore, minimax(nextBoard, true));
      nextBoard[index] = '';
    });
    return bestScore;
  }

  function findWinningMove(nextBoard, symbol) {
    return getEmptyIndexes(nextBoard).find((index) => {
      nextBoard[index] = symbol;
      const wins = getWinner(nextBoard) === symbol;
      nextBoard[index] = '';
      return wins;
    });
  }

  function getRandomMove(nextBoard) {
    const emptyIndexes = getEmptyIndexes(nextBoard);
    if (!emptyIndexes.length) return null;
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  }

  function finishIfNeeded() {
    const winner = getWinner(board);

    if (winner) {
      active = false;
      currentTurn = winner;
      highlightWinner(winner);
      updateTurn();
      setStatus(winner === human ? 'Parab\u00e9ns! Voc\u00ea venceu a partida.' : 'Tudo bem. Vamos tentar novamente com calma.', winner !== human);
      renderBoard();
      highlightWinner(winner);
      return true;
    }

    if (isDraw(board)) {
      active = false;
      turnElement.textContent = 'Empate';
      setStatus('Muito bem! A partida terminou empatada.');
      renderBoard();
      return true;
    }

    return false;
  }

  function highlightWinner(symbol) {
    const line = winningLines.find((items) => items.every((index) => board[index] === symbol));
    if (!line) return;

    line.forEach((index) => {
      const cell = boardElement.querySelector(`[data-index="${index}"]`);
      if (cell) cell.classList.add('winner');
    });
  }

  function getWinner(nextBoard) {
    const line = winningLines.find((items) => {
      const [first, second, third] = items;
      return nextBoard[first] && nextBoard[first] === nextBoard[second] && nextBoard[first] === nextBoard[third];
    });

    return line ? nextBoard[line[0]] : null;
  }

  function isDraw(nextBoard) {
    return nextBoard.every(Boolean) && !getWinner(nextBoard);
  }

  function getEmptyIndexes(nextBoard) {
    return nextBoard.map((value, index) => value ? null : index).filter((index) => index !== null);
  }

  function updateTurn() {
    if (!active && currentTurn === human) {
      turnElement.textContent = 'Jogador X';
      return;
    }

    if (!active && currentTurn === computer) {
      turnElement.textContent = 'Computador O';
      return;
    }

    turnElement.textContent = currentTurn === human ? 'Jogador X' : 'Computador O';
  }

  function setStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.classList.toggle('error', isError);
  }
});
