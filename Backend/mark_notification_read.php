<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $notification_id = $input['notification_id'] ?? '';
    $user_id = $input['user_id'] ?? '';

    if (empty($notification_id) || empty($user_id)) {
        throw new Exception('Parâmetros inválidos');
    }

    $notification_id = filter_var($notification_id, FILTER_VALIDATE_INT);
    $user_id = filter_var($user_id, FILTER_VALIDATE_INT);
    if ($notification_id === false || $user_id === false) {
        throw new Exception('IDs inválidos');
    }

    error_log("Marcando notificação ID $notification_id como lida para usuário ID $user_id");

    $query = "UPDATE notifications SET `read` = TRUE WHERE id = :notification_id AND user_id = :user_id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':notification_id', $notification_id, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

    if (!$stmt->execute()) {
        throw new Exception('Falha ao marcar notificação como lida');
    }

    if ($stmt->rowCount() === 0) {
        throw new Exception('Notificação não encontrada ou não pertence ao usuário');
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Notificação marcada como lida'
    ]);

} catch (Exception $e) {
    error_log("Erro ao marcar notificação: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao marcar notificação: ' . $e->getMessage()
    ]);
}
?>