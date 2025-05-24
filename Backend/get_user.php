<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=resingola', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

    if (!$user_id) {
        echo json_encode([
            'status' => 'error',
            'message' => 'user_id não fornecido',
            'request_data' => $_GET
        ]);
        exit;
    }

    $query = "SELECT nome, tel FROM usuario WHERE id = :user_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            'status' => 'success',
            'user' => [
                'nome' => $user['nome'],
                'tel' => $user['tel']
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Usuário não encontrado',
            'request_data' => ['user_id' => $user_id]
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'request_data' => $_GET
    ]);
}
?>