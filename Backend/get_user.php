<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once 'db.php';

// Inicia log detalhado
$logData = [
    'date' => date('Y-m-d H:i:s'),
    'request' => $_GET,
    'server' => $_SERVER,
    'post' => $_POST
];

try {
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        throw new Exception('ID do usuário não fornecido');
    }

    // Verifica se o ID é numérico
    if (!is_numeric($userId)) {
        throw new Exception('ID do usuário inválido (deve ser numérico)');
    }

    // Consulta melhorada com tratamento de erros
    $stmt = $pdo->prepare("SELECT 
        id, 
        nome AS nome,  -- Verifique se este campo existe
        tel AS tel,        -- Verifique se este campo existe
        FROM usuario           -- Alterado para plural (mais comum)
        WHERE id = ?");
    
    if (!$stmt->execute([$userId])) {
        throw new Exception('Erro ao executar consulta');
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        throw new Exception('Usuário não encontrado');
    }

    // Resposta padronizada
    $response = [
        'status' => 'success',
        'user' => [
            'id' => (int)$user['id'],
            'nome' => $user['nome'] ?? 'Nome não disponível',
            'tel' => $user['tel'] ?? 'Telefone não disponível',
        ]
    ];

    // Log de sucesso
    $logData['response'] = $response;
    file_put_contents('debug.log', json_encode($logData, JSON_PRETTY_PRINT) . "\n", FILE_APPEND);
    
    echo json_encode($response);

} catch (Exception $e) {
    // Log de erro detalhado
    $logData['error'] = $e->getMessage();
    file_put_contents('error.log', json_encode($logData, JSON_PRETTY_PRINT) . "\n", FILE_APPEND);
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'request_data' => $_GET // Para ajudar no debug
    ]);
}