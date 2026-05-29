<?php
// Conexao central do projeto.
$host = "ec2-3-131-141-8.us-east-2.compute.amazonaws.com";
$usuario = "usr_3d_g9";
$senha = "g9D@123";
$banco = "ads_3d_grupo9";

$conexao = mysqli_connect($host, $usuario, $senha, $banco);

if (!$conexao) {
    die("Erro na conexao com o banco de dados.");
}
?>
