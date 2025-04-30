<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../Backend/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->senha)) {
    try {
        $stmt = $pdo->prepare("SELECT id, nome, email, BI, tel, senha FROM usuario WHERE email = ?");
        $stmt->execute([$data->email]);
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($data->senha, $user['senha'])) {
                // Remove a senha antes de retornar os dados
                unset($user['senha']);
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login bem-sucedido',
                    'user' => $user
                ]);
                
            } else {
                http_response_code(401);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Senha incorreta'
                ]);
            }
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Usuário não encontrado'
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro no servidor: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email e senha são obrigatórios'
    ]);
}
?>