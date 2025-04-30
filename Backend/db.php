<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "resingola";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro na conexão: ' . $e->getMessage()
    ]);
    exit;
} 