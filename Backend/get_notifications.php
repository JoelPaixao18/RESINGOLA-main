<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/db.php';

try {
    if (!isset($_GET['user_id'])) {
        throw new Exception('Parâmetro user_id não fornecido');
    }

    $userId = filter_var($_GET['user_id'], FILTER_VALIDATE_INT);
    if ($userId === false || $userId <= 0) {
        throw new Exception('ID do usuário inválido');
    }

    error_log("Buscando notificações para o usuário ID: " . $userId);

    $query = "SELECT id, message, created_at, `read` FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatar a data para um formato legível
    foreach ($notifications as &$notification) {
        $notification['read'] = (bool)$notification['read'];
        $notification['created_at'] = date('d/m/Y H:i', strtotime($notification['created_at']));
    }

    echo json_encode([
        'status' => 'success',
        'notifications' => $notifications
    ]);

} catch (Exception $e) {
    error_log("Erro ao buscar notificações: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao buscar notificações: ' . $e->getMessage()
    ]);
}
?>