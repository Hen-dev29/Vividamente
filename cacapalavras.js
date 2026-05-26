document.addEventListener('DOMContentLoaded', () => {
  const words = ['MEM\u00d3RIA', 'ATEN\u00c7\u00c3O', 'SA\u00daDE', 'MENTE', 'FOCO', 'VIDA'];
  const size = 12;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const directions = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: -1 }
  ];

  const gridElement = document.getElementById('word-grid');
  const wordListElement = document.getElementById('word-list');
  const foundElement = document.getElementById('words-found');
  const totalElement = document.getElementById('words-total');
  const statusElement = document.getElementById('word-status');
  const newGameButton = document.getElementById('new-word-game');

  let grid = [];
  let foundWords = new Set();
  let selectedCells = [];
  let clickSelection = [];
  let isDragging = false;
  let suppressNextClick = false;

  newGameButton.addEventListener('click', startGame);
  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', stopDragging);
  startGame();

  function startGame() {
    grid = createEmptyGrid();
    foundWords = new Set();
    selectedCells = [];
    clickSelection = [];

    words.forEach(placeWord);
    fillEmptyCells();
    renderWordList();
    renderGrid();
    updateProgress();
    setStatus('Procure as palavras no seu tempo.');
  }

  function createEmptyGrid() {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
  }

  function placeWord(word) {
    const letters = Array.from(word);

    for (let attempt = 0; attempt < 200; attempt += 1) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (!canPlaceWord(letters, row, col, direction)) continue;

      letters.forEach((letter, index) => {
        grid[row + direction.row * index][col + direction.col * index] = letter;
      });
      return;
    }
  }

  function canPlaceWord(letters, row, col, direction) {
    return letters.every((letter, index) => {
      const nextRow = row + direction.row * index;
      const nextCol = col + direction.col * index;

      if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) return false;

      const currentLetter = grid[nextRow][nextCol];
      return currentLetter === '' || currentLetter === letter;
    });
  }

  function fillEmptyCells() {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (!grid[row][col]) {
          grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
  }

  function renderWordList() {
    wordListElement.innerHTML = '';
    words.forEach((word) => {
      const item = document.createElement('li');
      item.textContent = word;
      item.dataset.word = word;
      wordListElement.appendChild(item);
    });
  }

  function renderGrid() {
    gridElement.innerHTML = '';
    gridElement.style.setProperty('--word-grid-size', size);

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const cell = document.createElement('button');
        cell.className = 'word-cell';
        cell.type = 'button';
        cell.textContent = grid[row][col];
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.setAttribute('aria-label', `Letra ${grid[row][col]}`);

        cell.addEventListener('pointerdown', handlePointerDown);
        cell.addEventListener('pointerenter', handlePointerEnter);
        cell.addEventListener('pointerup', handlePointerUp);
        cell.addEventListener('click', handleCellClick);

        gridElement.appendChild(cell);
      }
    }

  }

  function handlePointerDown(event) {
    event.preventDefault();
    isDragging = true;
    selectedCells = [];
    clearSelection();
    addCellToSelection(event.currentTarget);
  }

  function handlePointerEnter(event) {
    if (!isDragging) return;
    addCellToSelection(event.currentTarget);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cell = element && element.closest ? element.closest('.word-cell') : null;
    if (cell && gridElement.contains(cell)) addCellToSelection(cell);
  }

  function handlePointerUp() {
    if (!isDragging) return;

    if (selectedCells.length > 1) {
      validateSelection(selectedCells);
      suppressNextClick = true;
    }
    stopDragging();
  }

  function stopDragging() {
    isDragging = false;
  }

  function handleCellClick(event) {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    const cell = event.currentTarget;
    if (!clickSelection.length) {
      clickSelection = [cell];
      clearSelection();
      cell.classList.add('selected');
      return;
    }

    if (!canExtendSelection(clickSelection, cell)) {
      showInvalidSelection();
      clickSelection = [cell];
      clearSelection();
      cell.classList.add('selected');
      return;
    }

    clickSelection.push(cell);
    clearSelection();
    clickSelection.forEach((selectedCell) => selectedCell.classList.add('selected'));

    const selectedWord = getSelectedWord(clickSelection);
    if (words.includes(selectedWord) || words.includes(reverseText(selectedWord))) {
      validateSelection(clickSelection);
      clickSelection = [];
      return;
    }

    if (!canStillBecomeWord(selectedWord)) {
      showInvalidSelection();
      clickSelection = [];
    }
  }

  function addCellToSelection(cell) {
    if (!cell || selectedCells.includes(cell)) return;
    if (selectedCells.length && !canExtendSelection(selectedCells, cell)) return;

    selectedCells.push(cell);
    cell.classList.add('selected');
  }

  function canExtendSelection(cells, nextCell) {
    if (cells.includes(nextCell)) return false;
    if (cells.length === 0) return true;

    const first = getCellPosition(cells[0]);
    const last = getCellPosition(cells[cells.length - 1]);
    const next = getCellPosition(nextCell);
    const rowStep = normalizeStep(next.row - last.row);
    const colStep = normalizeStep(next.col - last.col);

    if (Math.abs(next.row - last.row) > 1 || Math.abs(next.col - last.col) > 1) return false;
    if (rowStep === 0 && colStep === 0) return false;

    if (cells.length === 1) return true;

    const previous = getCellPosition(cells[1]);
    const expectedRowStep = normalizeStep(previous.row - first.row);
    const expectedColStep = normalizeStep(previous.col - first.col);
    return rowStep === expectedRowStep && colStep === expectedColStep;
  }

  function validateSelection(cells) {
    const selectedWord = getSelectedWord(cells);
    const reversedWord = reverseText(selectedWord);
    const matchedWord = words.find((word) => word === selectedWord || word === reversedWord);

    if (matchedWord && !foundWords.has(matchedWord)) {
      foundWords.add(matchedWord);
      cells.forEach((cell) => cell.classList.add('found'));
      markWordAsFound(matchedWord);
      updateProgress();

      if (foundWords.size === words.length) {
        setStatus('Parab\u00e9ns! Voc\u00ea concluiu o desafio.');
      } else {
        setStatus('Muito bem! Voc\u00ea encontrou uma palavra.');
      }
      clearSelection();
      return;
    }

    showInvalidSelection();
  }

  function showInvalidSelection() {
    setStatus('Essa palavra ainda n\u00e3o est\u00e1 na lista. Tente outra vez com calma.', true);
    setTimeout(clearSelection, 500);
  }

  function getSelectedWord(cells) {
    return cells.map((cell) => cell.textContent).join('');
  }

  function reverseText(text) {
    return Array.from(text).reverse().join('');
  }

  function canStillBecomeWord(text) {
    return words.some((word) => word.startsWith(text) || word.endsWith(text));
  }

  function getCellPosition(cell) {
    return {
      row: Number(cell.dataset.row),
      col: Number(cell.dataset.col)
    };
  }

  function normalizeStep(value) {
    if (value === 0) return 0;
    return value > 0 ? 1 : -1;
  }

  function clearSelection() {
    document.querySelectorAll('.word-cell.selected').forEach((cell) => {
      cell.classList.remove('selected');
    });
  }

  function markWordAsFound(word) {
    const item = wordListElement.querySelector(`[data-word="${word}"]`);
    if (item) item.classList.add('found');
  }

  function updateProgress() {
    foundElement.textContent = foundWords.size;
    totalElement.textContent = words.length;
  }

  function setStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.classList.toggle('error', isError);
  }
});
