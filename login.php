<?php
session_start();
require "conexao.php";

if (isset($_POST["login_usuario"])) {
    $usuario = mysqli_real_escape_string($conexao, trim($_POST["usuario"]));
    $senha = mysqli_real_escape_string($conexao, trim($_POST["senha"]));

    $sql = "SELECT * FROM login WHERE email = '$usuario' LIMIT 1";
    $resultado = mysqli_query($conexao, $sql);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $usuarioDB = mysqli_fetch_assoc($resultado);

        if (password_verify($senha, $usuarioDB["senha"])) {
            $_SESSION["usuario"] = $usuarioDB["email"];
            $_SESSION["nome"] = $usuarioDB["nome"];
            header("Location: index.php");
            exit;
        }

        $_SESSION["mensagem"] = "Senha incorreta.";
        header("Location: login.php");
        exit;
    }

    $_SESSION["mensagem"] = "Usuário não encontrado.";
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Vividamente</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include "navbar.php"; ?>

    <main>
        <div class="container">
            <div class="card" style="max-width: 520px; margin: 0 auto;">
                <h1 style="margin-bottom: 20px;">Login</h1>

                <?php if (isset($_SESSION["mensagem"])): ?>
                    <p class="message error"><?php echo $_SESSION["mensagem"]; ?></p>
                    <?php unset($_SESSION["mensagem"]); ?>
                <?php endif; ?>

                <form method="POST">
                    <div class="mb-3">
                        <label class="form-label" for="usuario">Usuário (e-mail)</label>
                        <input class="form-control" type="text" id="usuario" name="usuario" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="senha">Senha</label>
                        <input class="form-control" type="password" id="senha" name="senha" required>
                    </div>

                    <button class="btn" type="submit" name="login_usuario">Entrar</button>
                </form>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
