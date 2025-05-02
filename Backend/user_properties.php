<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../Backend/db.php'; // Verifique se o caminho está correto

try {
    // Verificação mais robusta do user_id
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

    // Query simplificada para teste inicial
    $query = "SELECT id, typeResi, price, location, houseSize, images 
              FROM residencia 
              WHERE user_id = :user_id 
              LIMIT 10"; // Limite adicionado para testes

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception("Falha ao executar a consulta");
    }

    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($properties)) {
        echo json_encode([
            'status' => 'success',
            'properties' => [],
            'message' => 'Nenhum imóvel encontrado para este usuário'
        ]);
        exit;
    }

    // Formatação dos dados com tratamento de erros
    $formattedProperties = [];
    foreach ($properties as $property) {
        try {
            $formattedProperties[] = [
                'id' => $property['id'] ?? null,
                'tipo' => $property['typeResi'] ?? 'Não especificado',
                'preco' => isset($property['price']) ? 'R$ ' . number_format($property['price'], 2, ',', '.') : 'Preço não informado',
                'localizacao' => $property['location'] ?? 'Localização não informada',
                'area' => $property['houseSize'] ?? 0,
                'imagens' => !empty($property['images']) ? json_decode($property['images'], true) : []
            ];
        } catch (Exception $e) {
            // Registra erro sem interromper o processamento dos demais itens
            error_log("Erro ao formatar propriedade ID {$property['id']}: " . $e->getMessage());
            continue;
        }
    }

    echo json_encode([
        'status' => 'success',
        'properties' => $formattedProperties
    ]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("ERRO NO ENDPOINT: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro interno no servidor',
        'system_message' => $e->getMessage() // Remova em produção
    ]);
}
?>