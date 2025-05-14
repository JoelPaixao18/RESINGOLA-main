<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../Backend/db.php';

function formatLocation($address) {
    // Remove termos desnecessários e formata
    $formatted = str_replace(['Província ', 'Município ', 'Angola, '], '', $address);
    $formatted = preg_replace('/\(.*?\)/', '', $formatted);
    $formatted = trim($formatted, ', ');
    
    // Extrai apenas cidade e bairro (se existir)
    $parts = explode(', ', $formatted);
    if (count($parts) > 1) {
        return $parts[0] . ', ' . $parts[1]; // Retorna "Cidade, Bairro"
    }
    return $parts[0]; // Retorna apenas o nome se não tiver vírgula
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($json)) {
        throw new Exception('Dados vazios recebidos');
    }

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Campos obrigatórios
    $requiredFields = ['images', 'houseSize', 'status', 'typeResi', 'typology', 'location', 'price', 'user_id'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("O campo $field é obrigatório");
        }
    }

    // Processamento dos dados
    $images = json_encode($data['images']);
    $location = formatLocation($data['location']); // Já formatado como texto simples
    $latitude = $data['latitude'] ?? null;
    $longitude = $data['longitude'] ?? null;

    // Outros campos
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
    $price = $data['price'];
    $user_id = $data['user_id'];

    // Query SQL
    $sql = "INSERT INTO residencia (
        images, houseSize, status, typeResi, typology,
        livingRoomCount, kitchenCount, hasWater, hasElectricity,
        bathroomCount, quintal, andares, garagem, varanda,
        location, latitude, longitude, price, user_id
    ) VALUES (
        :images, :houseSize, :status, :typeResi, :typology,
        :livingRoomCount, :kitchenCount, :hasWater, :hasElectricity,
        :bathroomCount, :quintal, :andares, :garagem, :varanda,
        :location, :latitude, :longitude, :price, :user_id
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
    $stmt->bindParam(':location', $location); // Agora é texto simples
    $stmt->bindParam(':latitude', $latitude);
    $stmt->bindParam(':longitude', $longitude);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Imóvel cadastrado com sucesso',
            'id' => $pdo->lastInsertId()
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