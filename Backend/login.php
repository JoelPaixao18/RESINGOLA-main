<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Formato de dados inválido');
    }

    if (empty($data['email']) || empty($data['senha'])) {
        throw new Exception('Email e senha são obrigatórios');
    }

    $email = $data['email'];
    $senha = $data['senha'];

    // Busca usuário pelo email
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('Email não encontrado');
    }

    // Verifica a senha
    if (!password_verify($senha, $user['senha'])) {
        throw new Exception('Senha incorreta');
    }

    // Remove dados sensíveis antes de retornar
    unset($user['senha']);

    echo json_encode([
        'status' => 'success',
        'message' => 'Login bem-sucedido',
        'user' => $user
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
