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
    $baseImageUrl = "http://192.168.20.217/RESINGOLA-main/uploads/";
    
    foreach ($residencias as &$res) {
        if (!empty($res['imagem'])) {
            $res['imagem'] = $baseImageUrl . $res['imagem'];
        }

            // --- INÍCIO DA MODIFICAÇÃO ---
        // Garante que latitude e longitude sejam números
        $res['latitude'] = isset($res['latitude']) ? (float)$res['latitude'] : 0;
        $res['longitude'] = isset($res['longitude']) ? (float)$res['longitude'] : 0;
        
        // Se location for JSON, decodifica para objeto
        if (!empty($res['location']) && is_string($res['location'])) {
            $locationData = json_decode($res['location'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $res['location'] = $locationData;
            }
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