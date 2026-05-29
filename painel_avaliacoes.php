<?php
session_start();
if (!isset($_SESSION["usuario"])) {
    header("Location: login.php");
    exit;
}

require_once "conexao.php";

$mensagemExclusaoSucesso = isset($_GET["sucesso_excluir"]);
$mensagemExclusaoErro = isset($_GET["erro_excluir"]);

// Garante que a tabela de resultados Likert exista para o painel nao falhar.
$sqlTabelaResultados = "
CREATE TABLE IF NOT EXISTS resultados_likert (
    id INT AUTO_INCREMENT PRIMARY KEY,
    avaliacao_id INT NOT NULL UNIQUE,
    usuario_anonimo VARCHAR(50) NOT NULL UNIQUE,
    soma_total INT NOT NULL,
    quantidade_respostas INT NOT NULL,
    media DECIMAL(5,2) NOT NULL,
    pontuacao_maxima INT NOT NULL,
    porcentagem DECIMAL(6,2) NOT NULL,
    classificacao VARCHAR(30) NOT NULL,
    data_calculo DATETIME DEFAULT CURRENT_TIMESTAMP
)";
mysqli_query($conexao, $sqlTabelaResultados);

$sql = "
SELECT
  a.id,
  a.data_resposta,
  r.usuario_anonimo,
  r.soma_total,
  r.media,
  r.porcentagem,
  r.classificacao
FROM avaliacoes a
LEFT JOIN resultados_likert r ON r.avaliacao_id = a.id
ORDER BY a.id ASC
";
$resultado = mysqli_query($conexao, $sql);
$avaliacoes = [];

if ($resultado) {
    $contadorUsuario = 1;
    while ($avaliacao = mysqli_fetch_assoc($resultado)) {
        // Numeracao anonima exibida no painel, recalculada conforme os registros atuais.
        $avaliacao["usuario_exibicao"] = "usuario_" . $contadorUsuario;
        $avaliacoes[] = $avaliacao;
        $contadorUsuario++;
    }

    $avaliacoes = array_reverse($avaliacoes);
}
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
      <p>Lista anônima das respostas enviadas com cálculo da escala Likert.</p>
      <p><a class="btn btn-secondary" href="logout.php">Sair</a></p>

      <?php if ($mensagemExclusaoSucesso): ?>
        <p class="message">Registro excluído com sucesso.</p>
      <?php endif; ?>

      <?php if ($mensagemExclusaoErro): ?>
        <p class="message error">Não foi possível excluir o registro.</p>
      <?php endif; ?>

      <div class="card">
        <div class="table-mobile-wrap">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px;">Usuário</th>
              <th style="text-align: left; padding: 10px;">Soma total</th>
              <th style="text-align: left; padding: 10px;">Média</th>
              <th style="text-align: left; padding: 10px;">Porcentagem</th>
              <th style="text-align: left; padding: 10px;">Classificação</th>
              <th style="text-align: left; padding: 10px;">Data</th>
              <th style="text-align: left; padding: 10px;">Visualizar</th>
              <th style="text-align: left; padding: 10px;">Excluir</th>
            </tr>
          </thead>
          <tbody>
            <?php if (count($avaliacoes) > 0): ?>
              <?php foreach ($avaliacoes as $avaliacao): ?>
                <tr>
                  <td style="padding: 10px;"><?php echo htmlspecialchars($avaliacao["usuario_exibicao"], ENT_QUOTES, "UTF-8"); ?></td>
                  <td style="padding: 10px;"><?php echo isset($avaliacao["soma_total"]) ? (int) $avaliacao["soma_total"] : "-"; ?></td>
                  <td style="padding: 10px;"><?php echo isset($avaliacao["media"]) ? number_format((float) $avaliacao["media"], 2, ",", ".") : "-"; ?></td>
                  <td style="padding: 10px;"><?php echo isset($avaliacao["porcentagem"]) ? (number_format((float) $avaliacao["porcentagem"], 2, ",", ".") . "%") : "-"; ?></td>
                  <td style="padding: 10px;"><?php echo htmlspecialchars($avaliacao["classificacao"] ?: "-", ENT_QUOTES, "UTF-8"); ?></td>
                  <td style="padding: 10px;"><?php echo htmlspecialchars($avaliacao["data_resposta"], ENT_QUOTES, "UTF-8"); ?></td>
                  <td style="padding: 10px;">
                    <a class="btn" href="avaliacao_view.php?id=<?php echo (int) $avaliacao["id"]; ?>">Visualizar</a>
                  </td>
                  <td style="padding: 10px;">
                    <form action="excluir_avaliacao.php" method="POST" onsubmit="return confirm('Tem certeza que deseja excluir este registro?');">
                      <input type="hidden" name="id" value="<?php echo (int) $avaliacao["id"]; ?>">
                      <button type="submit" class="btn btn-secondary">Excluir</button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php else: ?>
              <tr>
                <td colspan="8" style="padding: 10px;">Nenhuma avaliação encontrada.</td>
              </tr>
            <?php endif; ?>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
