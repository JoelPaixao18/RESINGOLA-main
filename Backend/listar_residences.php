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

    // Mantenha a query original sem JOIN para trazer todas as residências
    $sql = "SELECT * FROM residencia ORDER BY id DESC";
    $stmt = $conn->query($sql);
    $residencias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Caminho base da pasta onde estão as imagens
    $baseImageUrl = "http://192.168.124.25/RESINGOLA-main/uploads/";
    
    foreach ($residencias as &$res) {
        if (!empty($res['imagem'])) {
            $res['imagem'] = $baseImageUrl . $res['imagem'];
        }
    }
    

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