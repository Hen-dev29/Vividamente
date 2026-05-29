<?php
session_start();
if (!isset($_SESSION["usuario"])) {
    header("Location: login.php");
    exit;
}
require "conexao.php";
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Usuário - Editar</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <?php include "navbar.php"; ?>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Editar usuário
          <a href="index.php" class="btn btn-danger float-end">Voltar</a>
        </h4>
      </div>
      <div class="card-body">
        <?php
        $usuario = null;
        if (isset($_GET["id"])) {
            $usuarioId = mysqli_real_escape_string($conexao, $_GET["id"]);
            $query = mysqli_query($conexao, "SELECT * FROM login WHERE id = '$usuarioId' LIMIT 1");
            $usuario = $query ? mysqli_fetch_assoc($query) : null;
        }
        ?>
        <?php if ($usuario): ?>
          <form action="acoes.php" method="POST">
            <input type="hidden" name="usuario_id" value="<?php echo (int) $usuario["id"]; ?>">
            <div class="mb-3">
              <label>Nome</label>
              <input type="text" name="nome" value="<?php echo htmlspecialchars($usuario["nome"], ENT_QUOTES, "UTF-8"); ?>" class="form-control" required>
            </div>
            <div class="mb-3">
              <label>E-mail</label>
              <input type="email" name="email" value="<?php echo htmlspecialchars($usuario["email"], ENT_QUOTES, "UTF-8"); ?>" class="form-control" required>
            </div>
            <div class="mb-3">
              <label>Data de nascimento</label>
              <input type="date" name="data_nascimento" value="<?php echo htmlspecialchars($usuario["data_nascimento"], ENT_QUOTES, "UTF-8"); ?>" class="form-control" required>
            </div>
            <div class="mb-3">
              <label>Nova senha (opcional)</label>
              <input type="password" name="senha" class="form-control">
            </div>
            <button type="submit" name="update_usuario" class="btn btn-primary">Salvar</button>
          </form>
        <?php else: ?>
          <h5>Usuário não encontrado.</h5>
        <?php endif; ?>
      </div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
