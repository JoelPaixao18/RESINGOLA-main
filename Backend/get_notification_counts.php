<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/db.php';
session_start();

// Verificar se é admin
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Acesso negado'
    ]);
    exit();
}

try {
    // Buscar contagem de notificações não lidas
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_notifications WHERE read_status = 0");
    $unreadCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Buscar contagem de imóveis pendentes
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM residencia WHERE approval_status = 'pendente'");
    $pendingCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'status' => 'success',
        'unread_count' => (int)$unreadCount,
        'pending_count' => (int)$pendingCount
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao buscar contagens: ' . $e->getMessage()
    ]);
}
?> 