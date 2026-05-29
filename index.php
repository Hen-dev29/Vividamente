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
  <title>Painel - Vividamente</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <?php include "navbar.php"; ?>
  <div class="container mt-4">
    <?php include "mensagem.php"; ?>
    <div class="card">
      <div class="card-header">
        <h4>Painel
          <a href="usuario-create.php" class="btn btn-primary float-end">Adicionar usuário</a>
        </h4>
      </div>
      <div class="card-body">
        <div class="table-mobile-wrap">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Data de nascimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <?php
            $sql = "SELECT * FROM login";
            $usuarios = mysqli_query($conexao, $sql);
            if ($usuarios && mysqli_num_rows($usuarios) > 0):
                foreach ($usuarios as $usuario):
            ?>
              <tr>
                <td><?php echo (int) $usuario["id"]; ?></td>
                <td><?php echo htmlspecialchars($usuario["nome"], ENT_QUOTES, "UTF-8"); ?></td>
                <td><?php echo htmlspecialchars($usuario["email"], ENT_QUOTES, "UTF-8"); ?></td>
                <td><?php echo date("d/m/Y", strtotime($usuario["data_nascimento"])); ?></td>
                <td>
                  <a href="usuario-view.php?id=<?php echo (int) $usuario["id"]; ?>" class="btn btn-secondary btn-sm"><span class="bi-eye-fill"></span>&nbsp;Visualizar</a>
                  <a href="usuario-edit.php?id=<?php echo (int) $usuario["id"]; ?>" class="btn btn-success btn-sm"><span class="bi-pencil-fill"></span>&nbsp;Editar</a>
                  <form action="acoes.php" method="POST" class="d-inline">
                    <button onclick="return confirm('Tem certeza que deseja excluir?')" type="submit" name="delete_usuario" value="<?php echo (int) $usuario["id"]; ?>" class="btn btn-danger btn-sm">
                      <span class="bi-trash3-fill"></span>&nbsp;Excluir
                    </button>
                  </form>
                </td>
              </tr>
            <?php
                endforeach;
            else:
            ?>
              <tr><td colspan="5">Nenhum usuário encontrado.</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
        </div>
        <a href="logout.php">Sair</a>
      </div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
