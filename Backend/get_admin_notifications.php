<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

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
    // Buscar notificações não lidas primeiro, seguidas das lidas, ordenadas por data
    $query = "SELECT * FROM admin_notifications 
              ORDER BY read_status ASC, created_at DESC 
              LIMIT 50"; // Limita a 50 notificações mais recentes
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Contar notificações não lidas
    $unreadQuery = "SELECT COUNT(*) as count FROM admin_notifications WHERE read_status = 0";
    $unreadStmt = $pdo->prepare($unreadQuery);
    $unreadStmt->execute();
    $unreadCount = $unreadStmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'status' => 'success',
        'notifications' => $notifications,
        'unread_count' => $unreadCount
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao buscar notificações: ' . $e->getMessage()
    ]);
}
?> 