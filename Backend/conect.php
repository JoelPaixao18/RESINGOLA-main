<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../Backend/db.php'; // Caminho corrigido

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Validações
    $requiredFields = ['images', 'houseSize', 'status', 'typeResi', 'typology', 'location', 'price'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("O campo $field é obrigatório");
        }
    }

    // Converte o array de imagens para string JSON
    $images = json_encode($data['images']); // Corrige o erro "Array to string conversion"
    $houseSize = $data['houseSize'];
    $status = $data['status'];
    $typeResi = $data['typeResi'];
    $typology = $data['typology'];
    $livingRoomCount = $data['livingRoomCount'] ?? 0;
    $kitchenCount = $data['kitchenCount'] ?? 1;
    $hasWater = $data['hasWater'] ?? false;
    $hasElectricity = $data['hasElectricity'] ?? false;
    $bathroomCount = $data['bathroomCount'] ?? 1;
    $quintal = $data['quintal'] ?? false;
    $andares = $data['andares'] ?? 1;
    $garagem = $data['garagem'] ?? false;
    $varanda = $data['varanda'] ?? false;
    $location = $data['location'];
    $price = $data['price'];

    // Query SQL
    $sql = "INSERT INTO residencia (
        images, houseSize, status, typeResi, typology,
        livingRoomCount, kitchenCount, hasWater, hasElectricity,
        bathroomCount, quintal, andares, garagem, varanda,
        location, price
    ) VALUES (
        :images, :houseSize, :status, :typeResi, :typology,
        :livingRoomCount, :kitchenCount, :hasWater, :hasElectricity,
        :bathroomCount, :quintal, :andares, :garagem, :varanda,
        :location, :price
    )";

    $stmt = $pdo->prepare($sql);
    
    // Bind dos parâmetros
    $stmt->bindParam(':images', $images);
    $stmt->bindParam(':houseSize', $houseSize);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':typeResi', $typeResi);
    $stmt->bindParam(':typology', $typology);
    $stmt->bindParam(':livingRoomCount', $livingRoomCount, PDO::PARAM_INT);
    $stmt->bindParam(':kitchenCount', $kitchenCount, PDO::PARAM_INT);
    $stmt->bindParam(':hasWater', $hasWater, PDO::PARAM_BOOL);
    $stmt->bindParam(':hasElectricity', $hasElectricity, PDO::PARAM_BOOL);
    $stmt->bindParam(':bathroomCount', $bathroomCount, PDO::PARAM_INT);
    $stmt->bindParam(':quintal', $quintal, PDO::PARAM_BOOL);
    $stmt->bindParam(':andares', $andares, PDO::PARAM_INT);
    $stmt->bindParam(':garagem', $garagem, PDO::PARAM_BOOL);
    $stmt->bindParam(':varanda', $varanda, PDO::PARAM_BOOL);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':price', $price);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Imóvel cadastrado com sucesso',
            'id' => $pdo->lastInsertId() // Corrigido: usa $pdo em vez de $conn
        ]);
    } else {
        throw new Exception('Erro ao executar a query: ' . implode(', ', $stmt->errorInfo()));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no cadastro: ' . $e->getMessage()
    ]);
}