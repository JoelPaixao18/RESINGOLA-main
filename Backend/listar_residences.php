<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/db.php';

try {
    $sql = "SELECT * FROM residencia WHERE approval_status = 'aprovado' ORDER BY id DESC";
    $stmt = $pdo->query($sql);
    $residencias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Log para depuração
    error_log('Dados brutos de residencia: ' . json_encode($residencias, JSON_PRETTY_PRINT));

    // URL base para as imagens
    $baseImageUrl = "http://192.168.213.25/RESINGOLA-main/Backend/uploads/";
    
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
        'message' => 'Imóveis aprovados carregados com sucesso',
        'total' => count($residencias),
        'data' => $residencias
    ]);
} catch (PDOException $err) {
    error_log("Erro ao buscar residências: " . $err->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao buscar residências: ' . $err->getMessage(),
        'total' => 0,
        'data' => []
    ]);
}
?>