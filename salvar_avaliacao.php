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

/*
 * Logica adicionada: calcula os resultados da escala Likert por respondente.
 */
$resultadoLikert = calcularResultadoLikert(array_values($respostas));

/*
 * Logica adicionada: cria tabela de resultados caso ainda nao exista.
 * Mantem a pesquisa anonima usando o padrao usuario_{id_da_avaliacao}.
 */
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
    data_calculo DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resultado_avaliacao
        FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id)
        ON DELETE CASCADE
)";

try {
    mysqli_begin_transaction($conexao);

    mysqli_query($conexao, $sqlTabelaResultados);

    $camposSql = implode(", ", array_keys($respostas));
    $placeholders = implode(", ", array_fill(0, count($respostas), "?"));
    $sqlSalvarAvaliacao = "INSERT INTO avaliacoes ({$camposSql}) VALUES ({$placeholders})";
    $stmtAvaliacao = mysqli_prepare($conexao, $sqlSalvarAvaliacao);

    if (!$stmtAvaliacao) {
        throw new Exception("Falha ao preparar insert da avaliacao.");
    }

    $valoresRespostas = array_values($respostas);
    $tiposRespostas = str_repeat("i", count($valoresRespostas));
    mysqli_stmt_bind_param($stmtAvaliacao, $tiposRespostas, ...$valoresRespostas);
    mysqli_stmt_execute($stmtAvaliacao);

    $avaliacaoId = (int) mysqli_insert_id($conexao);
    $usuarioAnonimo = "usuario_" . $avaliacaoId;

    $sqlSalvarResultado = "
        INSERT INTO resultados_likert (
            avaliacao_id,
            usuario_anonimo,
            soma_total,
            quantidade_respostas,
            media,
            pontuacao_maxima,
            porcentagem,
            classificacao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ";
    $stmtResultado = mysqli_prepare($conexao, $sqlSalvarResultado);

    if (!$stmtResultado) {
        throw new Exception("Falha ao preparar insert do resultado.");
    }

    $somaTotal = (int) $resultadoLikert["soma_total"];
    $quantidadeRespostas = (int) $resultadoLikert["quantidade_respostas"];
    $media = round((float) $resultadoLikert["media"], 2);
    $pontuacaoMaxima = (int) $resultadoLikert["pontuacao_maxima"];
    $porcentagem = round((float) $resultadoLikert["porcentagem"], 2);
    $classificacao = (string) $resultadoLikert["classificacao"];

    mysqli_stmt_bind_param(
        $stmtResultado,
        "isiidids",
        $avaliacaoId,
        $usuarioAnonimo,
        $somaTotal,
        $quantidadeRespostas,
        $media,
        $pontuacaoMaxima,
        $porcentagem,
        $classificacao
    );
    mysqli_stmt_execute($stmtResultado);

    mysqli_commit($conexao);
    header("Location: avaliacao.php?sucesso=1");
    exit;
} catch (mysqli_sql_exception $erro) {
    // A tela do participante exibe apenas a mensagem simples de erro.
    mysqli_rollback($conexao);
} catch (Exception $erro) {
    mysqli_rollback($conexao);
}

header("Location: avaliacao.php?erro=1");
exit;
?>
