document.addEventListener('DOMContentLoaded', () => {
  const size = 12;
  const storageKey = 'vividamenteCrosswordProgress';
  const words = [
    { id: 1, word: 'MEMORIA', label: 'MEM\u00d3RIA', row: 1, col: 1, direction: 'across', clue: 'Capacidade de lembrar informa\u00e7\u00f5es.' },
    { id: 2, word: 'FOCO', label: 'FOCO', row: 0, col: 4, direction: 'down', clue: 'Concentra\u00e7\u00e3o em uma tarefa.' },
    { id: 3, word: 'MENTE', label: 'MENTE', row: 1, col: 1, direction: 'down', clue: 'Espa\u00e7o dos pensamentos e ideias.' },
    { id: 4, word: 'ATENCAO', label: 'ATEN\u00c7\u00c3O', row: 6, col: 0, direction: 'across', clue: 'Cuidado mental ao perceber algo.' },
    { id: 5, word: 'VIDA', label: 'VIDA', row: 3, col: 7, direction: 'down', clue: 'Experi\u00eancia que cultivamos todos os dias.' },
    { id: 6, word: 'LOGICA', label: 'L\u00d3GICA', row: 0, col: 9, direction: 'down', clue: 'Forma organizada de pensar.' },
    { id: 7, word: 'LEITURA', label: 'LEITURA', row: 8, col: 3, direction: 'across', clue: 'Atividade de compreender textos.' },
    { id: 8, word: 'SAUDE', label: 'SA\u00daDE', row: 7, col: 11, direction: 'down', clue: 'Bem-estar f\u00edsico e mental.' },
    { id: 9, word: 'BEMESTAR', label: 'BEMESTAR', row: 10, col: 0, direction: 'across', clue: 'Estado de equil\u00edbrio e conforto.' },
    { id: 10, word: 'RACIOCINIO', label: 'RACIOC\u00cdNIO', row: 11, col: 0, direction: 'across', clue: 'Processo de pensar e resolver problemas.' }
  ];

  const gridElement = document.getElementById('crossword-grid');
  const acrossClues = document.getElementById('across-clues');
  const downClues = document.getElementById('down-clues');
  const statusElement = document.getElementById('crossword-status');
  const completedElement = document.getElementById('crossword-completed');
  const totalElement = document.getElementById('crossword-total');
  const timeElement = document.getElementById('crossword-time');
  const newButton = document.getElementById('new-crossword');
  const checkButton = document.getElementById('check-crossword');
  const hintButton = document.getElementById('hint-crossword');

  let cells = [];
  let activeWordId = words[0].id;
  let completedWords = new Set();
  let elapsedSeconds = 0;
  let timer = null;

  newButton.addEventListener('click', () => startGame(true));
  checkButton.addEventListener('click', checkAnswers);
  hintButton.addEventListener('click', showHint);
  startGame(false);

  function startGame(isNewGame) {
    cells = createCells();
    completedWords = new Set();
    activeWordId = words[0].id;
    elapsedSeconds = 0;
    timeElement.textContent = '00:00';
    buildSolution();
    renderClues();
    renderGrid();
    loadProgress(isNewGame);
    startTimer();
    updateProgress();
    selectWord(activeWordId);
    setStatus(isNewGame ? 'Novo desafio iniciado.' : 'Leia as pistas e complete as palavras no seu tempo.');
  }

  function createCells() {
    return Array.from({ length: size }, (_, row) => (
      Array.from({ length: size }, (_, col) => ({
        row,
        col,
        solution: '',
        value: '',
        words: [],
        number: null,
        correct: false
      }))
    ));
  }

  function buildSolution() {
    words.forEach((entry) => {
      Array.from(entry.word).forEach((letter, index) => {
        const row = entry.row + (entry.direction === 'down' ? index : 0);
        const col = entry.col + (entry.direction === 'across' ? index : 0);
        const cell = cells[row][col];
        cell.solution = letter;
        cell.words.push(entry.id);
        if (index === 0) cell.number = entry.id;
      });
    });
  }

  function renderClues() {
    acrossClues.innerHTML = '';
    downClues.innerHTML = '';

    words.forEach((entry) => {
      const item = document.createElement('li');
      item.dataset.wordId = entry.id;
      item.innerHTML = `<button type="button"><strong>${entry.id}. ${entry.label}</strong><span>${entry.clue}</span></button>`;
      item.querySelector('button').addEventListener('click', () => selectWord(entry.id));

      if (entry.direction === 'across') acrossClues.appendChild(item);
      if (entry.direction === 'down') downClues.appendChild(item);
    });
  }

  function renderGrid() {
    gridElement.innerHTML = '';
    gridElement.style.setProperty('--crossword-size', size);

    cells.flat().forEach((cell) => {
      const wrapper = document.createElement('div');
      wrapper.className = cell.solution ? 'crossword-cell' : 'crossword-cell blocked';

      if (!cell.solution) {
        gridElement.appendChild(wrapper);
        return;
      }

      if (cell.number) {
        const number = document.createElement('span');
        number.className = 'crossword-number';
        number.textContent = cell.number;
        wrapper.appendChild(number);
      }

      const input = document.createElement('input');
      input.maxLength = 1;
      input.inputMode = 'text';
      input.autocomplete = 'off';
      input.dataset.row = cell.row;
      input.dataset.col = cell.col;
      input.value = cell.value;
      input.setAttribute('aria-label', `Linha ${cell.row + 1}, coluna ${cell.col + 1}`);
      input.addEventListener('focus', () => selectWord(cell.words.includes(activeWordId) ? activeWordId : cell.words[0]));
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', handleKeydown);

      wrapper.appendChild(input);
      gridElement.appendChild(wrapper);
    });
  }

  function selectWord(wordId) {
    activeWordId = wordId;
    clearHighlights();

    getWordCells(wordId).forEach((cell) => {
      const input = getInput(cell);
      if (input) input.parentElement.classList.add('active');
    });

    document.querySelectorAll('.crossword-clues li').forEach((item) => {
      item.classList.toggle('active', Number(item.dataset.wordId) === wordId);
    });
  }

  function handleInput(event) {
    const input = event.currentTarget;
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    const cell = cells[row][col];
    const value = normalizeLetter(input.value);

    input.value = value;
    cell.value = value;
    cell.correct = false;
    input.parentElement.classList.remove('correct', 'incorrect');
    saveProgress();

    if (value) focusNextCell(cell);
    updateProgress();
  }

  function handleKeydown(event) {
    const input = event.currentTarget;
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    if (event.key === 'Backspace' && !input.value) {
      event.preventDefault();
      focusPreviousCell(cells[row][col]);
    }
  }

  function checkAnswers() {
    const activeCells = getWordCells(activeWordId);
    const activeCorrect = isWordCorrect(activeWordId);

    if (activeCorrect && !completedWords.has(activeWordId)) {
      completedWords.add(activeWordId);
      markWord(activeWordId, true);
      setStatus('Muito bem! Voc\u00ea acertou uma palavra.');
    } else if (!activeCorrect) {
      activeCells.forEach((cell) => {
        const input = getInput(cell);
        if (input) input.parentElement.classList.add('incorrect');
      });
      setStatus('Essa palavra ainda n\u00e3o est\u00e1 correta. Tente novamente com calma.', true);
    }

    words.forEach((entry) => {
      if (isWordCorrect(entry.id)) {
        completedWords.add(entry.id);
        markWord(entry.id, true);
      }
    });

    updateProgress();
    saveProgress();

    if (completedWords.size === words.length) {
      window.clearInterval(timer);
      setStatus('Parab\u00e9ns! Voc\u00ea concluiu as palavras cruzadas.');
    }
  }

  function showHint() {
    const emptyCell = getWordCells(activeWordId).find((cell) => cell.value !== cell.solution);
    if (!emptyCell) {
      setStatus('Essa palavra j\u00e1 est\u00e1 completa.');
      return;
    }

    emptyCell.value = emptyCell.solution;
    const input = getInput(emptyCell);
    if (input) {
      input.value = emptyCell.solution;
      input.focus();
    }
    setStatus('Dica mostrada. Continue no seu tempo.');
    saveProgress();
    updateProgress();
  }

  function markWord(wordId, isCorrect) {
    getWordCells(wordId).forEach((cell) => {
      const input = getInput(cell);
      if (input) {
        input.parentElement.classList.toggle('correct', isCorrect);
        input.parentElement.classList.remove('incorrect');
      }
    });

    document.querySelectorAll('.crossword-clues li').forEach((item) => {
      if (Number(item.dataset.wordId) === wordId) item.classList.add('completed');
    });
  }

  function updateProgress() {
    words.forEach((entry) => {
      if (isWordCorrect(entry.id)) completedWords.add(entry.id);
    });

    completedElement.textContent = completedWords.size;
    totalElement.textContent = words.length;
  }

  function getWordCells(wordId) {
    const entry = words.find((item) => item.id === wordId);
    if (!entry) return [];

    return Array.from(entry.word).map((_, index) => {
      const row = entry.row + (entry.direction === 'down' ? index : 0);
      const col = entry.col + (entry.direction === 'across' ? index : 0);
      return cells[row][col];
    });
  }

  function isWordCorrect(wordId) {
    return getWordCells(wordId).every((cell) => cell.value === cell.solution);
  }

  function focusNextCell(cell) {
    const wordCells = getWordCells(activeWordId);
    const index = wordCells.indexOf(cell);
    const nextCell = wordCells[index + 1];
    const input = nextCell && getInput(nextCell);
    if (input) input.focus();
  }

  function focusPreviousCell(cell) {
    const wordCells = getWordCells(activeWordId);
    const index = wordCells.indexOf(cell);
    const previousCell = wordCells[index - 1];
    const input = previousCell && getInput(previousCell);
    if (input) {
      previousCell.value = '';
      input.value = '';
      input.focus();
      saveProgress();
    }
  }

  function getInput(cell) {
    return gridElement.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
  }

  function clearHighlights() {
    document.querySelectorAll('.crossword-cell.active').forEach((item) => item.classList.remove('active'));
  }

  function normalizeLetter(value) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 1)
      .toUpperCase();
  }

  function saveProgress() {
    const values = cells.flat()
      .filter((cell) => cell.solution)
      .map((cell) => ({ row: cell.row, col: cell.col, value: cell.value }));
    localStorage.setItem(storageKey, JSON.stringify({ values, elapsedSeconds }));
  }

  function loadProgress(ignoreSaved) {
    if (ignoreSaved) {
      localStorage.removeItem(storageKey);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      elapsedSeconds = Number(data.elapsedSeconds) || 0;
      timeElement.textContent = formatTime(elapsedSeconds);
      data.values.forEach((item) => {
        if (cells[item.row] && cells[item.row][item.col]) {
          cells[item.row][item.col].value = item.value || '';
        }
      });
      renderGrid();
    } catch (error) {
      localStorage.removeItem(storageKey);
    }
  }

  function startTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      elapsedSeconds += 1;
      timeElement.textContent = formatTime(elapsedSeconds);
      saveProgress();
    }, 1000);
  }

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function setStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.classList.toggle('error', isError);
  }
});
