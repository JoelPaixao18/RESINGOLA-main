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

    // URL base para as imagens
    $baseImageUrl = "http://192.168.20.217/RESINGOLA-main/Backend/uploads/uploads";
    
    foreach ($residencias as &$res) {
        // Decodificar o JSON de imagens
        $images = json_decode($res['images'], true) ?: [];
        
        // Se houver imagens, pegar a primeira como imagem principal
        if (!empty($images)) {
            $res['image'] = $baseImageUrl . $images[0];
            $res['images'] = array_map(function($img) use ($baseImageUrl) {
                return $baseImageUrl . $img;
            }, $images);
        } else {
            $res['image'] = 'https://via.placeholder.com/150';
            $res['images'] = [];
        }

        // Formatando outros campos
        $res['latitude'] = isset($res['latitude']) ? (float)$res['latitude'] : 0;
        $res['longitude'] = isset($res['longitude']) ? (float)$res['longitude'] : 0;
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