<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once 'db.php';

// Log completo
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - REQUEST: " . print_r($_GET, true) . "\n", FILE_APPEND);

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    file_put_contents('debug.log', "ERROR: Missing user_id\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID do usuário não fornecido']);
    exit;
}

try {
    file_put_contents('debug.log', "Querying database for user_id: $userId\n", FILE_APPEND);
    
    $stmt = $pdo->prepare("SELECT nome, tel FROM usuario WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    file_put_contents('debug.log', "Database result: " . print_r($user, true) . "\n", FILE_APPEND);
    
    if ($user) {
        echo json_encode([
            'status' => 'success',
            'user' => [
                'id' => (int)$userId,
                'nome' => $user['nome'],
                'tel' => $user['tel']
            ]
        ]);
    } else {
        file_put_contents('debug.log', "User not found\n", FILE_APPEND);
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Usuário não encontrado']);
    }
} catch (Exception $e) {
    file_put_contents('debug.log', "EXCEPTION: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}