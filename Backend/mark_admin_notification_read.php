<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");  // Altere para seu domínio específico
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Lidar com requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';
session_start();

// Verificar se é admin
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Acesso negado',
        'debug' => [
            'session_exists' => isset($_SESSION),
            'logged_in' => $_SESSION['loggedin'] ?? false,
            'role' => $_SESSION['role'] ?? 'none'
        ]
    ]);
    exit();
}

try {
    // Verificar se o corpo da requisição está vazio
    $rawInput = file_get_contents('php://input');
    if (empty($rawInput)) {
        throw new Exception('Dados da requisição vazios');
    }

    // Tentar decodificar o JSON
    $input = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Verificar se o ID da notificação foi fornecido
    $notification_id = $input['notification_id'] ?? null;
    if (!$notification_id) {
        throw new Exception('ID da notificação não fornecido');
    }

    // Verificar se a notificação existe e pertence ao admin
    $checkQuery = "SELECT id FROM admin_notifications WHERE id = :id";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->execute(['id' => $notification_id]);
    
    if (!$checkStmt->fetch()) {
        throw new Exception('Notificação não encontrada');
    }

    // Atualizar o status da notificação
    $query = "UPDATE admin_notifications SET read_status = 1 WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['id' => $notification_id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('Falha ao atualizar a notificação');
    }

    // Buscar o novo número de notificações não lidas
    $countQuery = "SELECT COUNT(*) as count FROM admin_notifications WHERE read_status = 0";
    $countStmt = $pdo->query($countQuery);
    $unreadCount = $countStmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'status' => 'success',
        'message' => 'Notificação marcada como lida',
        'unread_count' => $unreadCount
    ]);

} catch (Exception $e) {
    error_log('Erro ao marcar notificação: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao marcar notificação: ' . $e->getMessage(),
        'debug' => [
            'raw_input' => $rawInput ?? null,
            'parsed_input' => $input ?? null,
            'error_details' => $e->getMessage()
        ]
    ]);
}
?> 