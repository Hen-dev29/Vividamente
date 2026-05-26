<?php
require_once "conexao.php";
require_once "acoes-avaliacoes.php";

$id = isset($_GET["id"]) ? (int) $_GET["id"] : 0;
if ($id <= 0) {
    die("ID inválido.");
}

$sql = "SELECT * FROM avaliacoes WHERE id = {$id} LIMIT 1";
$resultado = mysqli_query($conexao, $sql);
$avaliacao = $resultado ? mysqli_fetch_assoc($resultado) : null;

if (!$avaliacao) {
    die("Avaliação não encontrada.");
}

$perguntas = obterPerguntasLikert();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detalhes da Avaliação - Vividamente</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <a class="brand" href="index.html" aria-label="Vividamente - Início">
      <img src="assets/logo-vividamente.png" alt="">
      <span>Vividamente</span>
    </a>
    <nav aria-label="Menu principal">
      <ul>
        <li><a href="index.html">Início</a></li>
        <li><a href="jogos.html">Jogos</a></li>
        <li><a href="progresso.html">Progresso</a></li>
        <li><a href="sobre.html">Sobre</a></li>
        <li><a href="ajuda.html">Ajuda</a></li>
        <li><a href="avaliacao.php">Avaliação</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <div class="container">
      <h1>Detalhes da Avaliação</h1>

      <div class="card">
        <p><strong>ID:</strong> <?php echo (int) $avaliacao["id"]; ?></p>
        <p><strong>Data da resposta:</strong> <?php echo htmlspecialchars($avaliacao["data_resposta"], ENT_QUOTES, "UTF-8"); ?></p>
      </div>

      <div class="card">
        <h2>Perguntas e respostas</h2>
        <?php foreach ($perguntas as $numero => $pergunta): ?>
          <?php $campo = "p" . $numero; ?>
          <p>
            <strong><?php echo $numero . ". " . htmlspecialchars($pergunta, ENT_QUOTES, "UTF-8"); ?></strong><br>
            <?php echo htmlspecialchars(converterRespostaLikert((int) $avaliacao[$campo]), ENT_QUOTES, "UTF-8"); ?>
          </p>
        <?php endforeach; ?>
      </div>

      <a class="btn" href="painel_avaliacoes.php">Voltar para o painel</a>
    </div>
  </main>
</body>
</html>
