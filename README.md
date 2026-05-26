# 🧠 Vividamente

O **Vividamente** é uma plataforma de jogos cognitivos desenvolvida com foco na estimulação mental de idosos, utilizando jogos interativos e um sistema de avaliação em escala Likert para análise da experiência do usuário.

## 📌 Objetivo

O projeto busca auxiliar no estímulo de:
- memória;
- atenção;
- raciocínio lógico;
- concentração;
- interação cognitiva.

Além disso, a plataforma coleta avaliações dos usuários para analisar acessibilidade, usabilidade e experiência geral durante o uso dos jogos.

---

# 🎮 Jogos disponíveis

- Jogo da Memória
- Genius
- Damas
- Caça-palavras
- Palavras Cruzadas
- Jogo da Velha

---

# 📊 Sistema de Avaliação

A plataforma possui uma área de avaliação baseada na **Escala Likert**, contendo 21 perguntas relacionadas à experiência do usuário.

As respostas utilizam a escala:

| Valor | Resposta |
|------|------|
| 1 | Discordo totalmente 😟 |
| 2 | Discordo 🙁 |
| 3 | Neutro 😐 |
| 4 | Concordo 😊 |
| 5 | Concordo totalmente 😎 |

As respostas são armazenadas em um banco de dados MySQL de forma anônima.

---

# 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- PHP
- MySQL
- Bootstrap
- XAMPP
- GitHub

---

# 📂 Estrutura do Projeto

```txt
vividamente/
├── index.html
├── jogos.html
├── memoria.html
├── genius.html
├── damas.html
├── cacapalavras.html
├── palavrascruzadas.html
├── jogodavelha.html
├── ajuda.html
├── sobre.html
├── progresso.html
│
├── styles.css
├── script.js
│
├── conexao.php
├── navbar.php
├── mensagem.php
├── login.php
├── logout.php
├── index.php
├── usuario-create.php
├── usuario-edit.php
├── usuario-view.php
├── acoes.php
│
├── avaliacao.php
├── salvar_avaliacao.php
├── painel_avaliacoes.php
├── avaliacao_view.php
├── acoes-avaliacoes.php
└── banco_avaliacoes.sql
