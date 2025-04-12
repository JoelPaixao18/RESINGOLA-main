<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "resingola";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM residencia ORDER BY id DESC";
    $stmt = $conn->query($sql);
    $residencias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $residencias
    ]);
} catch (PDOException $err) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao buscar residências: ' . $err->getMessage()
    ]);
}
