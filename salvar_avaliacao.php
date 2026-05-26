<?php
require_once "conexao.php";
require_once "acoes-avaliacoes.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: avaliacao.php?erro=1");
    exit;
}

$perguntas = obterPerguntasLikert();
$respostas = [];

foreach ($perguntas as $numero => $textoPergunta) {
    $campo = "p" . $numero;

    if (!isset($_POST[$campo])) {
        header("Location: avaliacao.php?erro=1");
        exit;
    }

    $valor = (int) $_POST[$campo];
    if ($valor < 1 || $valor > 5) {
        header("Location: avaliacao.php?erro=1");
        exit;
    }

    $respostas[$campo] = $valor;
}

$camposSql = implode(", ", array_keys($respostas));
$valoresSql = implode(", ", array_map("intval", array_values($respostas)));
$sql = "INSERT INTO avaliacoes ({$camposSql}) VALUES ({$valoresSql})";

try {
    if (mysqli_query($conexao, $sql)) {
        header("Location: avaliacao.php?sucesso=1");
        exit;
    }
} catch (mysqli_sql_exception $erro) {
    // A tela do participante exibe apenas a mensagem simples de erro.
}

header("Location: avaliacao.php?erro=1");
exit;
?>
