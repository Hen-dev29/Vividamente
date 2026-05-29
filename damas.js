document.addEventListener('DOMContentLoaded', () => {
  const size = 8;
  const player = 'player';
  const computer = 'computer';
  const messages = {
    initial: 'Escolha uma pe\u00e7a para come\u00e7ar.',
    playerTurn: 'Sua vez. Escolha uma pe\u00e7a e mova com calma.',
    computerTurn: 'O computador est\u00e1 pensando.',
    capture: 'Boa jogada! Voc\u00ea capturou uma pe\u00e7a.',
    promotion: 'Excelente! Sua pe\u00e7a virou dama.',
    victory: 'Parab\u00e9ns! Voc\u00ea venceu a partida.',
    defeat: 'Tudo bem. Vamos tentar novamente com calma.',
    invalid: 'Esse movimento n\u00e3o \u00e9 poss\u00edvel. Escolha outra casa.'
  };

  const boardElement = document.getElementById('checkers-board');
  const newGameButton = document.getElementById('new-checkers-game');
  const hintButton = document.getElementById('hint-checkers');
  const turnLabel = document.getElementById('turn-label');
  const timeLabel = document.getElementById('game-time');
  const playerCapturesLabel = document.getElementById('player-captures');
  const computerCapturesLabel = document.getElementById('computer-captures');
  const statusLabel = document.getElementById('checkers-status');

  let board = [];
  let selected = null;
  let possibleMoves = [];
  let turn = player;
  let playerCaptures = 0;
  let computerCaptures = 0;
  let elapsedSeconds = 0;
  let timer = null;
  let gameFinished = false;

  newGameButton.addEventListener('click', startGame);
  hintButton.addEventListener('click', showHint);
  startGame();

  function startGame() {
    board = createBoard();
    selected = null;
    possibleMoves = [];
    turn = player;
    playerCaptures = 0;
    computerCaptures = 0;
    elapsedSeconds = 0;
    gameFinished = false;
    startTimer();
    setStatus(messages.initial);
    updatePanel();
    renderBoard();
  }

  function createBoard() {
    const nextBoard = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (!isPlayableSquare(row, col)) continue;
        if (row < 3) nextBoard[row][col] = createPiece(computer);
        if (row > 4) nextBoard[row][col] = createPiece(player);
      }
    }

    return nextBoard;
  }

  function createPiece(owner) {
    return { owner, king: false };
  }

  function renderBoard() {
    boardElement.innerHTML = '';

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const square = document.createElement('button');
        const piece = board[row][col];
        const move = possibleMoves.find((item) => item.to.row === row && item.to.col === col);
        const isSelected = selected && selected.row === row && selected.col === col;

        square.className = `checkers-square ${isPlayableSquare(row, col) ? 'dark' : 'light'}`;
        square.type = 'button';
        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute('aria-label', getSquareLabel(row, col, piece, move));

        if (isSelected) square.classList.add('selected');
        if (move) square.classList.add(move.capture ? 'capture-move' : 'possible-move');

        if (piece) {
          const pieceElement = document.createElement('span');
          pieceElement.className = `checker-piece ${piece.owner} ${piece.king ? 'king' : ''}`;
          square.appendChild(pieceElement);
        }

        square.addEventListener('click', handleSquareClick);
        boardElement.appendChild(square);
      }
    }
  }

  function handleSquareClick(event) {
    if (gameFinished || turn !== player) return;

    const row = Number(event.currentTarget.dataset.row);
    const col = Number(event.currentTarget.dataset.col);
    const piece = board[row][col];
    const selectedMove = possibleMoves.find((move) => move.to.row === row && move.to.col === col);

    if (selectedMove) {
      movePiece(selectedMove);
      return;
    }

    if (piece && piece.owner === player) {
      selected = { row, col };
      possibleMoves = getMovesForPiece(row, col);
      setStatus(possibleMoves.length ? messages.playerTurn : messages.invalid, !possibleMoves.length);
      renderBoard();
      return;
    }

    setStatus(messages.invalid, true);
  }

  function movePiece(move) {
    const piece = board[move.from.row][move.from.col];
    board[move.from.row][move.from.col] = null;
    board[move.to.row][move.to.col] = piece;

    if (move.capture) {
      board[move.capture.row][move.capture.col] = null;
      if (piece.owner === player) playerCaptures += 1;
      if (piece.owner === computer) computerCaptures += 1;
    }

    const promoted = promoteIfNeeded(piece, move.to.row);
    selected = null;
    possibleMoves = [];
    updatePanel();
    renderBoard();

    if (checkEndGame()) return;

    if (piece.owner === player) {
      setStatus(promoted ? messages.promotion : (move.capture ? messages.capture : messages.computerTurn));
      turn = computer;
      updatePanel();
      window.setTimeout(playComputerTurn, 850);
    } else {
      turn = player;
      updatePanel();
      setStatus(promoted ? 'O computador promoveu uma pe\u00e7a.' : messages.playerTurn);
      checkEndGame();
    }
  }

  function playComputerTurn() {
    if (gameFinished || turn !== computer) return;

    const moves = getAllMoves(computer);
    if (!moves.length) {
      finishGame(player);
      return;
    }

    const captures = moves.filter((move) => move.capture);
    const choices = captures.length ? captures : moves;
    const move = choices[Math.floor(Math.random() * choices.length)];
    movePiece(move);
  }

  function getAllMoves(owner) {
    const moves = [];

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const piece = board[row][col];
        if (piece && piece.owner === owner) {
          moves.push(...getMovesForPiece(row, col));
        }
      }
    }

    return moves;
  }

  function getMovesForPiece(row, col) {
    const piece = board[row][col];
    if (!piece) return [];

    return piece.king ? getKingMoves(row, col, piece) : getRegularMoves(row, col, piece);
  }

  function getRegularMoves(row, col, piece) {
    const moves = [];
    const rowDirection = piece.owner === player ? -1 : 1;
    const steps = [
      { row: rowDirection, col: -1 },
      { row: rowDirection, col: 1 }
    ];
    const captureSteps = [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ];

    steps.forEach((step) => {
      const to = { row: row + step.row, col: col + step.col };
      if (isInsideBoard(to.row, to.col) && !board[to.row][to.col]) {
        moves.push({ from: { row, col }, to, capture: null });
      }
    });

    captureSteps.forEach((step) => {
      const middle = { row: row + step.row, col: col + step.col };
      const to = { row: row + step.row * 2, col: col + step.col * 2 };
      if (!isInsideBoard(to.row, to.col) || !isInsideBoard(middle.row, middle.col)) return;

      const target = board[middle.row][middle.col];
      if (target && target.owner !== piece.owner && !board[to.row][to.col]) {
        moves.push({ from: { row, col }, to, capture: middle });
      }
    });

    return moves;
  }

  function getKingMoves(row, col, piece) {
    const moves = [];
    const diagonals = [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ];

    diagonals.forEach((direction) => {
      let nextRow = row + direction.row;
      let nextCol = col + direction.col;
      let captured = null;

      while (isInsideBoard(nextRow, nextCol)) {
        const occupant = board[nextRow][nextCol];

        if (!occupant) {
          moves.push({
            from: { row, col },
            to: { row: nextRow, col: nextCol },
            capture: captured
          });
        } else if (occupant.owner === piece.owner || captured) {
          break;
        } else {
          captured = { row: nextRow, col: nextCol };
        }

        nextRow += direction.row;
        nextCol += direction.col;
      }
    });

    return moves;
  }

  function promoteIfNeeded(piece, row) {
    if (piece.king) return false;
    if ((piece.owner === player && row === 0) || (piece.owner === computer && row === size - 1)) {
      piece.king = true;
      return true;
    }
    return false;
  }

  function showHint() {
    if (gameFinished || turn !== player) return;

    const moves = getAllMoves(player);
    if (!moves.length) {
      finishGame(computer);
      return;
    }

    const captures = moves.filter((move) => move.capture);
    const move = (captures.length ? captures : moves)[0];
    selected = move.from;
    possibleMoves = getMovesForPiece(move.from.row, move.from.col);
    setStatus(captures.length ? 'Dica: existe uma captura poss\u00edvel.' : 'Dica: esta pe\u00e7a tem um movimento poss\u00edvel.');
    renderBoard();
  }

  function checkEndGame() {
    const playerPieces = countPieces(player);
    const computerPieces = countPieces(computer);

    if (computerPieces === 0 || getAllMoves(computer).length === 0) {
      finishGame(player);
      return true;
    }

    if (playerPieces === 0 || getAllMoves(player).length === 0) {
      finishGame(computer);
      return true;
    }

    return false;
  }

  function finishGame(winner) {
    gameFinished = true;
    selected = null;
    possibleMoves = [];
    window.clearInterval(timer);
    setStatus(winner === player ? messages.victory : messages.defeat, winner !== player);
    renderBoard();
  }

  function countPieces(owner) {
    return board.flat().filter((piece) => piece && piece.owner === owner).length;
  }

  function updatePanel() {
    turnLabel.textContent = turn === player ? 'Jogador' : 'Computador';
    playerCapturesLabel.textContent = playerCaptures;
    computerCapturesLabel.textContent = computerCaptures;
  }

  function startTimer() {
    window.clearInterval(timer);
    timeLabel.textContent = '00:00';
    timer = window.setInterval(() => {
      elapsedSeconds += 1;
      timeLabel.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function setStatus(message, isError = false) {
    statusLabel.textContent = message;
    statusLabel.classList.toggle('error', isError);
  }

  function getSquareLabel(row, col, piece, move) {
    const position = `linha ${row + 1}, coluna ${col + 1}`;
    if (move && move.capture) return `Capturar para ${position}`;
    if (move) return `Mover para ${position}`;
    if (!piece) return `Casa vazia, ${position}`;
    const owner = piece.owner === player ? 'jogador' : 'computador';
    return `${piece.king ? 'Dama' : 'Pe\u00e7a'} do ${owner}, ${position}`;
  }

  function isPlayableSquare(row, col) {
    return (row + col) % 2 === 1;
  }

  function isInsideBoard(row, col) {
    return row >= 0 && row < size && col >= 0 && col < size;
  }
});
