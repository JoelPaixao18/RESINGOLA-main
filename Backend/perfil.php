<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

try {
    $stmt = $pdo->prepare("SELECT id, nome, email, tel FROM usuario WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 'success',
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Usuário não encontrado'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?>
