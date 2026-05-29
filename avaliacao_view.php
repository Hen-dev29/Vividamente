<?php
session_start();
if (!isset($_SESSION["usuario"])) {
    header("Location: login.php");
    exit;
}

require_once "conexao.php";
require_once "acoes-avaliacoes.php";

$id = isset($_GET["id"]) ? (int) $_GET["id"] : 0;
if ($id <= 0) {
    die("ID inválido.");
}

$sql = "
SELECT
  a.*,
  r.usuario_anonimo,
  r.soma_total,
  r.quantidade_respostas,
  r.media,
  r.pontuacao_maxima,
  r.porcentagem,
  r.classificacao
FROM avaliacoes a
LEFT JOIN resultados_likert r ON r.avaliacao_id = a.id
WHERE a.id = {$id}
LIMIT 1
";
$resultado = mysqli_query($conexao, $sql);
$avaliacao = $resultado ? mysqli_fetch_assoc($resultado) : null;

if (!$avaliacao) {
    die("Avaliação não encontrada.");
}

$sqlPosicaoUsuario = "SELECT COUNT(*) AS posicao FROM avaliacoes WHERE id <= {$id}";
$resultadoPosicao = mysqli_query($conexao, $sqlPosicaoUsuario);
$posicaoUsuario = $resultadoPosicao ? (int) mysqli_fetch_assoc($resultadoPosicao)["posicao"] : 0;
$usuarioExibicao = "usuario_" . max(1, $posicaoUsuario);

$perguntas = obterPerguntasLikert();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel - Vividamente</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <?php include "navbar.php"; ?>

  <main>
    <div class="container">
      <h1>Painel</h1>

      <div class="card">
        <p><strong>ID:</strong> <?php echo (int) $avaliacao["id"]; ?></p>
        <p><strong>Usuário:</strong> <?php echo htmlspecialchars($usuarioExibicao, ENT_QUOTES, "UTF-8"); ?></p>
        <p><strong>Data da resposta:</strong> <?php echo htmlspecialchars($avaliacao["data_resposta"], ENT_QUOTES, "UTF-8"); ?></p>
      </div>

      <div class="card">
        <h2>Resultado da Escala Likert</h2>
        <p><strong>Soma total:</strong> <?php echo isset($avaliacao["soma_total"]) ? (int) $avaliacao["soma_total"] : "-"; ?></p>
        <p><strong>Quantidade de respostas:</strong> <?php echo isset($avaliacao["quantidade_respostas"]) ? (int) $avaliacao["quantidade_respostas"] : "-"; ?></p>
        <p><strong>Média:</strong> <?php echo isset($avaliacao["media"]) ? number_format((float) $avaliacao["media"], 2, ",", ".") : "-"; ?></p>
        <p><strong>Pontuação máxima:</strong> <?php echo isset($avaliacao["pontuacao_maxima"]) ? (int) $avaliacao["pontuacao_maxima"] : "-"; ?></p>
        <p><strong>Porcentagem:</strong> <?php echo isset($avaliacao["porcentagem"]) ? (number_format((float) $avaliacao["porcentagem"], 2, ",", ".") . "%") : "-"; ?></p>
        <p><strong>Classificação:</strong> <?php echo htmlspecialchars($avaliacao["classificacao"] ?: "-", ENT_QUOTES, "UTF-8"); ?></p>
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
      <a class="btn btn-secondary" href="logout.php">Sair</a>
    </div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
