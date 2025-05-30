<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

require_once __DIR__ . '/db.php';

// Debug do ambiente
error_log("Document Root: " . $_SERVER['DOCUMENT_ROOT']);
error_log("Script Path: " . __FILE__);

// URL BASE para servir imagens
$baseImageUrl = "http://192.168.213.25/RESINGOLA-main/Backend/uploads/";
error_log("Base Image URL: " . $baseImageUrl);

// Função para verificar se a imagem existe
function imageExists($path) {
    $fullPath = str_replace('http://192.168.213.25/RESINGOLA-main/', $_SERVER['DOCUMENT_ROOT'] . '/RESINGOLA-main/', $path);
    error_log("Verificando existência da imagem em: " . $fullPath);
    $exists = file_exists($fullPath);
    error_log("Imagem existe? " . ($exists ? "Sim" : "Não"));
    if (!$exists) {
        error_log("Conteúdo do diretório: " . print_r(scandir(dirname($fullPath)), true));
    }
    return $exists;
}

try {
    if (!isset($_GET['user_id'])) {
        throw new Exception('Parâmetro user_id não fornecido');
    }

    $userId = filter_var($_GET['user_id'], FILTER_VALIDATE_INT);
    if ($userId === false || $userId <= 0) {
        throw new Exception('ID do usuário inválido');
    }

    error_log("Buscando propriedades para o usuário ID: " . $userId);

    // Primeiro, vamos verificar o valor bruto da coluna images
    $checkQuery = "SELECT id, images FROM residencia WHERE user_id = :user_id";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $checkStmt->execute();
    
    $rawImages = $checkStmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("Dados brutos das imagens do banco:");
    foreach ($rawImages as $raw) {
        error_log("ID: " . $raw['id'] . " - Images: " . print_r($raw['images'], true));
    }

    // Query principal, incluindo approval_status
    $query = "SELECT id, typeResi, price, location, houseSize, images, description, bathroomCount, typology, user_id
              FROM residencia 
              WHERE user_id = :user_id AND approval_status = 'aprovado'";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception("Falha ao executar a consulta");
    }

    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("Número de propriedades encontradas: " . count($properties));

    $formattedProperties = [];
    foreach ($properties as $property) {
        error_log("\n--- Processando propriedade ID: " . $property['id'] . " ---");
        
        $images = [];
        if (!empty($property['images'])) {
            error_log("Valor bruto do campo images: " . $property['images']);
            $decoded = json_decode($property['images'], true);
            
            if ($decoded === null) {
                error_log("Erro ao decodificar JSON: " . json_last_error_msg());
                // Se não for JSON válido, tenta usar como string única
                if (is_string($property['images'])) {
                    $images = [$property['images']];
                }
            } else if (is_array($decoded)) {
                error_log("Array de imagens decodificado: " . print_r($decoded, true));
                
                // Processa cada imagem para garantir o formato correto
                $images = array_map(function($img) use ($baseImageUrl) {
                    // Remove qualquer barra inicial
                    $img = ltrim($img, '/');
                    
                    // Remove prefixos de diretório desnecessários
                    $img = preg_replace('/^(Backend\/Uploads\/|Uploads\/)/', '', $img);
                    
                    // Se o nome da imagem começa com 'uploads', remove
                    $img = preg_replace('/^Uploads/', '', $img);
                    
                    // Adiciona o baseImageUrl
                    return $baseImageUrl . $img;
                }, $decoded);
            }
        }

        error_log("Imagens processadas: " . print_r($images, true));

        $formattedProperties[] = [
            'id' => $property['id'],
            'quartos' => $property['typology'] ?? 'Nºs de quartos não especificados',
            'banheiros' => $property['bathroomCount'] ?? 'Nºs de banheiros não especificados',
            'tipo' => $property['typeResi'] ?? 'Não especificado',
            'preco' => isset($property['price']) ? 'kz ' . number_format($property['price'], 2, ',', '.') : 'Preço não informado',
            'localizacao' => $property['location'] ?? 'Localização não informada',
            'area' => $property['houseSize'] ?? 0,
            'descricao' => $property['description'] ?? 'Nenhuma descrição fornecida',
            'imagens' => $images,
            'user_id' => $property['user_id'],
            'approval_status' => $property['approval_status'] ?? 'pendente'
        ];
    }

    $response = [
        'status' => 'success',
        'properties' => $formattedProperties
    ];
    
    error_log("Resposta final: " . json_encode($response));
    echo json_encode($response);

} catch (Exception $e) {
    error_log("Erro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>