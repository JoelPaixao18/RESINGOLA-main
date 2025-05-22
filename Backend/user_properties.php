
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include_once '../Backend/db.php';

// URL BASE CORRETA (igual ao Home.js)
$baseImageUrl = "http://192.168.20.217/RESINGOLA-main/Backend/uploads/";

try {
    if (!isset($_GET['user_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Parâmetro user_id não fornecido']);
        exit;
    }

    $userId = filter_var($_GET['user_id'], FILTER_VALIDATE_INT);
    if ($userId === false || $userId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID do usuário inválido']);
        exit;
    }

    $query = "SELECT id, typeResi, price, location, houseSize, images, description, bathroomCount, typology
              FROM residencia 
              WHERE user_id = :user_id 
              LIMIT 10";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception("Falha ao executar a consulta");
    }

    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedProperties = [];
    foreach ($properties as $property) {
        // DECODIFICA CORRETAMENTE AS IMAGENS
        $images = [];
        if (!empty($property['images'])) {
            $decoded = json_decode($property['images'], true);
            
            // Verifica se é um array válido
            if (is_array($decoded)) {
                $images = array_map(function($img) use ($baseImageUrl) {
                    // Remove caminhos absolutos se existirem
                    $cleanImg = basename($img);
                    return $baseImageUrl . $cleanImg;
                }, $decoded);
            }
        }

        $formattedProperties[] = [
            'id' => $property['id'],
            'quartos' => $property['typology'] ?? 'Nºs de quartos não especificados',
            'banheiros' => $property['bathroomCount'] ?? 'Nºs de banheiros não especificados',
            'tipo' => $property['typeResi'] ?? 'Não especificado',
            'preco' => isset($property['price']) ? 'kz ' . number_format($property['price'], 2, ',', '.') : 'Preço não informado',
            'localizacao' => $property['location'] ?? 'Localização não informada',
            'area' => $property['houseSize'] ?? 0,
            'descricao' => $property['description'] ?? 'Nenhuma descricão fornecida',
            'imagens' => $images // JÁ COM URL COMPLETA
        ];
    }

    echo json_encode([
        'status' => 'success',
        'properties' => $formattedProperties
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro interno no servidor'
    ]);
}
?>