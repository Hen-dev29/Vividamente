<?php
session_start();
if (!isset($_SESSION["usuario"])) {
    header("Location: login.php");
    exit;
}

require_once "conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: painel_avaliacoes.php");
    exit;
}

$id = isset($_POST["id"]) ? (int) $_POST["id"] : 0;
if ($id <= 0) {
    header("Location: painel_avaliacoes.php?erro_excluir=1");
    exit;
}

try {
    mysqli_begin_transaction($conexao);

    // Remove primeiro do consolidado Likert (quando existir) para manter consistencia.
    $sqlDeleteResultado = "DELETE FROM resultados_likert WHERE avaliacao_id = ?";
    $stmtResultado = mysqli_prepare($conexao, $sqlDeleteResultado);
    if ($stmtResultado) {
        mysqli_stmt_bind_param($stmtResultado, "i", $id);
        mysqli_stmt_execute($stmtResultado);
    }

    // Remove a avaliacao original.
    $sqlDeleteAvaliacao = "DELETE FROM avaliacoes WHERE id = ?";
    $stmtAvaliacao = mysqli_prepare($conexao, $sqlDeleteAvaliacao);
    if (!$stmtAvaliacao) {
        throw new Exception("Falha ao preparar exclusao.");
    }

    mysqli_stmt_bind_param($stmtAvaliacao, "i", $id);
    mysqli_stmt_execute($stmtAvaliacao);

    mysqli_commit($conexao);
    header("Location: painel_avaliacoes.php?sucesso_excluir=1");
    exit;
} catch (Throwable $erro) {
    mysqli_rollback($conexao);
    header("Location: painel_avaliacoes.php?erro_excluir=1");
    exit;
}
?>
