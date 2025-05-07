<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Debug: Registrar o raw input
file_put_contents('input.log', file_get_contents('php://input'));

require_once __DIR__ . '/../Backend/db.php';

// Adicione esta função no início do arquivo
function formatLocation($address) {
    // Remove "Província" e "Município"
    $formatted = str_replace(['Província ', 'Município '], '', $address);
    
    // Remove qualquer conteúdo entre parênteses (se houver)
    $formatted = preg_replace('/\(.*?\)/', '', $formatted);
    
    // Remove espaços extras e vírgulas desnecessárias
    $formatted = trim($formatted, ', ');
    
    return $formatted;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

        // Verificação extra do JSON
        if (empty($json)) {
            throw new Exception('Dados vazios recebidos');
        }
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Validações básicas
    $requiredFields = ['images', 'houseSize', 'status', 'typeResi', 'typology', 'location', 'price'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("O campo $field é obrigatório");
        }
    }

    // Processamento das imagens
    $images = json_encode($data['images']);
    

    // No seu código, antes de inserir no banco:
    $formattedLocation = formatLocation($data['location']);
    $locationData = [
        'address' => $formattedLocation, // Usa a versão formatada
        'coordinates' => [
            'lat' => $data['latitude'] ?? null,
            'lng' => $data['longitude'] ?? null
        ]
        ];
    $location = json_encode($locationData);

    // Preparação dos outros campos
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

    // Query SQL
    $sql = "INSERT INTO residencia (
        images, houseSize, status, typeResi, typology,
        livingRoomCount, kitchenCount, hasWater, hasElectricity,
        bathroomCount, quintal, andares, garagem, varanda,
        location, latitude, longitude, price
    ) VALUES (
        :images, :houseSize, :status, :typeResi, :typology,
        :livingRoomCount, :kitchenCount, :hasWater, :hasElectricity,
        :bathroomCount, :quintal, :andares, :garagem, :varanda,
        :location, :latitude, :longitude, :price
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
    $stmt->bindParam(':latitude', $data['latitude']);
    $stmt->bindParam(':longitude', $data['longitude']);
    $stmt->bindParam(':price', $price);

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