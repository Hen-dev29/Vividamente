<?php
require_once "acoes-avaliacoes.php";

$mensagemSucesso = isset($_GET["sucesso"]);
$mensagemErro = isset($_GET["erro"]);
$perguntas = obterPerguntasLikert();
$escala = obterEscalaLikert();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vividamente - Avaliação da Plataforma</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="pagina-avaliacao">
  <header>
    <a class="brand" href="index.html" aria-label="Vividamente - In&iacute;cio">
      <img src="assets/logo-vividamente.png" alt="">
      <span>Vividamente</span>
    </a>
    <nav aria-label="Menu principal">
      <ul>
        <li><a href="index.html">In&iacute;cio</a></li>
        <li><a href="jogos.html">Jogos</a></li>
        <li><a href="sobre.html">Sobre</a></li>
        <li><a href="avaliacao.php">Avalia&ccedil;&atilde;o</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <div class="container">
      <h1>Avaliação da Plataforma</h1>
      <p>Responda às perguntas abaixo marcando a opção que melhor representa sua experiência com o Vividamente.</p>

      <?php if ($mensagemSucesso): ?>
        <p class="message">Avaliação enviada com sucesso!</p>
      <?php endif; ?>

      <?php if ($mensagemErro): ?>
        <p class="message error">Erro ao enviar avaliação. Tente novamente.</p>
      <?php endif; ?>

      <form class="form-avaliacao" action="salvar_avaliacao.php" method="POST">
        <section class="legenda-likert" id="legenda-likert" aria-label="Legenda da escala Likert">
          <h2>Como responder</h2>
          <?php foreach ($escala as $valor => $texto): ?>
            <p><strong><?php echo $valor; ?></strong> = <?php echo htmlspecialchars($texto, ENT_QUOTES, "UTF-8"); ?></p>
          <?php endforeach; ?>
        </section>

        <?php foreach ($perguntas as $numero => $pergunta): ?>
          <fieldset class="pergunta" aria-describedby="legenda-likert">
            <legend><?php echo $numero . ". " . htmlspecialchars($pergunta, ENT_QUOTES, "UTF-8"); ?></legend>
            <div class="opcoes-likert">
              <?php foreach ($escala as $valor => $texto): ?>
                <label>
                  <input type="radio" name="p<?php echo $numero; ?>" value="<?php echo $valor; ?>" <?php echo $valor === 1 ? "required" : ""; ?>>
                  <?php echo htmlspecialchars($texto, ENT_QUOTES, "UTF-8"); ?>
                </label>
              <?php endforeach; ?>
            </div>
          </fieldset>
        <?php endforeach; ?>

        <button class="btn btn-enviar-avaliacao" type="submit">Enviar avaliação</button>
      </form>
    </div>
  </main>
</body>
</html>



