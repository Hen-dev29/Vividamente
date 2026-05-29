<?php
/*
 * Funcoes auxiliares da avaliacao Likert.
 * Centralizar perguntas e escala facilita a manutencao.
 */

function obterPerguntasLikert()
{
    return [
        1 => "O aplicativo foi fácil de entender?",
        2 => "Houve facilidade em enxergar os ícones dos jogos?",
        3 => "Você gostaria de continuar usando o aplicativo no dia a dia?",
        4 => "Os jogos fizeram você se sentir mais concentrado(a)?",
        5 => "Os jogos fizeram você se sentir mais feliz?",
        6 => "Os jogos fizeram você se sentir mais ativo(a)?",
        7 => "Os jogos eram interessantes?",
        8 => "Os jogos foram divertidos?",
        9 => "As instruções dos jogos estavam fáceis de entender?",
        10 => "Os menus estavam claros e autoexplicativos?",
        11 => "Sentiu que sua atenção melhorou depois dos jogos?",
        12 => "Percebeu melhora em relação à sua memória?",
        13 => "O aplicativo proporcionou momentos agradáveis?",
        14 => "O tamanho das letras facilitou a leitura?",
        15 => "O aplicativo possui boa qualidade visual?",
        16 => "O aplicativo é divertido?",
        17 => "Considero os jogos apropriados para a terceira idade?",
        18 => "Os jogos prenderam a sua atenção?",
        19 => "O aplicativo pareceu organizado?",
        20 => "Os jogos te desafiaram a raciocinar?",
        21 => "Os aplicativos foram intuitivos?"
    ];
}

function obterEscalaLikert()
{
    return [
        1 => "Discordo totalmente 😟",
        2 => "Discordo 🙁",
        3 => "Neutro 😐",
        4 => "Concordo 😊",
        5 => "Concordo totalmente 😎"
    ];
}

function converterRespostaLikert($valor)
{
    $escala = obterEscalaLikert();
    return isset($escala[$valor]) ? $escala[$valor] : "Não informado";
}

/*
 * Logica adicionada: calculo consolidado da escala Likert por respondente.
 * Mantem os valores existentes de 1 a 5 e gera soma, media, porcentagem e classificacao.
 */
function calcularResultadoLikert(array $respostas)
{
    $quantidadeRespostas = count($respostas);
    $somaTotal = array_sum($respostas);
    $pontuacaoMaxima = $quantidadeRespostas * 5;
    $media = $quantidadeRespostas > 0 ? ($somaTotal / $quantidadeRespostas) : 0;
    $porcentagem = $pontuacaoMaxima > 0 ? (($somaTotal / $pontuacaoMaxima) * 100) : 0;

    return [
        "soma_total" => $somaTotal,
        "quantidade_respostas" => $quantidadeRespostas,
        "media" => $media,
        "pontuacao_maxima" => $pontuacaoMaxima,
        "porcentagem" => $porcentagem,
        "classificacao" => classificarMediaLikert($media)
    ];
}

/*
 * Logica adicionada: classificacao automatica pela media.
 */
function classificarMediaLikert($media)
{
    if ($media >= 1.0 && $media <= 1.9) {
        return "Muito negativo";
    }

    if ($media >= 2.0 && $media <= 2.9) {
        return "Negativo";
    }

    if ($media >= 3.0 && $media <= 3.4) {
        return "Neutro";
    }

    if ($media >= 3.5 && $media <= 4.4) {
        return "Positivo";
    }

    if ($media >= 4.5 && $media <= 5.0) {
        return "Muito positivo";
    }

    return "Nao classificado";
}
