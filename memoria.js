// Logica do Jogo da Memoria
document.addEventListener('DOMContentLoaded', () => {
  const figuras = ['🍎', '🍌', '🍓', '🍇', '🍊', '🍉', '🍍', '🥑'];
  const itens = embaralhar([...figuras, ...figuras]);
  const tabuleiro = document.querySelector('.memory-board');
  let primeiraCarta = null;
  let segundaCarta = null;
  let bloquearTabuleiro = false;
  let tentativas = 0;
  const tentativasDisplay = document.getElementById('attempts');
  const mensagemDisplay = document.getElementById('message');

  itens.forEach((item) => {
    const carta = document.createElement('div');
    carta.classList.add('memory-card');
    carta.dataset.value = item;
    carta.innerHTML = `
      <div class="front">${item}</div>
      <div class="back"></div>
    `;
    carta.addEventListener('click', virarCarta);
    tabuleiro.appendChild(carta);
  });

  function virarCarta() {
    if (bloquearTabuleiro || this === primeiraCarta) return;
    this.classList.add('flipped');

    if (!primeiraCarta) {
      primeiraCarta = this;
      return;
    }

    segundaCarta = this;
    verificarPar();
  }

  function verificarPar() {
    const acertou = primeiraCarta.dataset.value === segundaCarta.dataset.value;
    tentativas += 1;
    tentativasDisplay.textContent = tentativas;

    if (acertou) {
      primeiraCarta.removeEventListener('click', virarCarta);
      segundaCarta.removeEventListener('click', virarCarta);
      mensagemDisplay.textContent = 'Ótimo! Continue tentando, você está indo bem.';
      resetarJogada();
      return;
    }

    bloquearTabuleiro = true;
    mensagemDisplay.textContent = 'Não foi desta vez, tente novamente!';
    setTimeout(() => {
      primeiraCarta.classList.remove('flipped');
      segundaCarta.classList.remove('flipped');
      resetarJogada();
    }, 1000);
  }

  function resetarJogada() {
    primeiraCarta = null;
    segundaCarta = null;
    bloquearTabuleiro = false;
  }

  function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
});
