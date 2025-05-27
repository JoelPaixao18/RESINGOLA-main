<?php
header('Content-Type: application/json');

// Configurar CORS corretamente para permitir credenciais
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Lidar com a requisição preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';
session_start();

// Verificar se é admin
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true || $_SESSION['role'] !== 'admin') {
    // Log para debug
    error_log("Sessão não autenticada: " . print_r($_SESSION, true));
    
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Acesso negado. Sessão inválida.',
        'session_debug' => [
            'session_exists' => isset($_SESSION),
            'logged_in' => $_SESSION['loggedin'] ?? false,
            'role' => $_SESSION['role'] ?? 'none'
        ]
    ]);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $property_id = $input['property_id'] ?? '';
    $action = $input['action'] ?? '';

    if (empty($property_id) || !in_array($action, ['approve', 'reject'])) {
        throw new Exception('Parâmetros inválidos');
    }

    // Buscar user_id do imóvel
    $stmt = $pdo->prepare("SELECT user_id FROM residencia WHERE id = :id");
    $stmt->execute(['id' => $property_id]);
    $property = $stmt->fetch();

    if (!$property) {
        throw new Exception('Imóvel não encontrado');
    }

    $status = $action === 'approve' ? 'aprovado' : 'rejeitado';
    $stmt = $pdo->prepare("UPDATE residencia SET approval_status = :status WHERE id = :id");
    $stmt->execute(['status' => $status, 'id' => $property_id]);

    // Inserir notificação
    $notification_message = $action === 'approve' 
        ? 'Seu imóvel foi aprovado e está visível no aplicativo.'
        : 'Seu imóvel foi rejeitado. Entre em contato com o suporte para mais detalhes.';
    $stmt = $pdo->prepare("INSERT INTO notifications (user_id, message, created_at) VALUES (:user_id, :message, NOW())");
    $stmt->execute([
        'user_id' => $property['user_id'],
        'message' => $notification_message
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => "Imóvel " . ($action === 'approve' ? 'aprovado' : 'rejeitado') . " com sucesso"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro: ' . $e->getMessage()
    ]);
}
?>