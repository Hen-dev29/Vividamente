<?php
// Conexao central do projeto (CRUD + avaliacao).
$host = "SEU_HOST";
$usuario = "SEU_USUARIO";
$senha = "SUA_SENHA";
$banco = "SEU_BANCO";
$conexao = mysqli_connect($host, $usuario, $senha, $banco);

if (!$conexao) {
    die("Erro na conexao com o banco de dados.");
}
?>
