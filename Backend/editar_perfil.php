<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || empty($data->nome) || empty($data->email) || empty($data->tel)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos os campos são obrigatórios'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE usuario SET nome = ?, email = ?, tel = ? WHERE id = ?");
    if ($stmt->execute([$data->nome, $data->email, $data->tel, $data->id])) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Perfil atualizado com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao atualizar perfil'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?>
