<?php
require_once "conexao.php";

$sql = "SELECT id, data_resposta FROM avaliacoes ORDER BY id DESC";
$resultado = mysqli_query($conexao, $sql);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel de Avaliações - Vividamente</title>
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
      <h1>Painel de Avaliações</h1>
      <p>Lista anônima das respostas enviadas.</p>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px;">ID</th>
              <th style="text-align: left; padding: 10px;">Data</th>
              <th style="text-align: left; padding: 10px;">Visualizar</th>
            </tr>
          </thead>
          <tbody>
            <?php if ($resultado && mysqli_num_rows($resultado) > 0): ?>
              <?php while ($avaliacao = mysqli_fetch_assoc($resultado)): ?>
                <tr>
                  <td style="padding: 10px;"><?php echo (int) $avaliacao["id"]; ?></td>
                  <td style="padding: 10px;"><?php echo htmlspecialchars($avaliacao["data_resposta"], ENT_QUOTES, "UTF-8"); ?></td>
                  <td style="padding: 10px;">
                    <a class="btn" href="avaliacao_view.php?id=<?php echo (int) $avaliacao["id"]; ?>">Visualizar</a>
                  </td>
                </tr>
              <?php endwhile; ?>
            <?php else: ?>
              <tr>
                <td colspan="3" style="padding: 10px;">Nenhuma avaliação encontrada.</td>
              </tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</body>
</html>
