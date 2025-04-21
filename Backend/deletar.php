<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'ID da residência não informado'
        ]);
        exit;
    }

    $id = $input['id'];

    try {
        $stmt = $pdo->prepare("DELETE FROM residencia WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Residência deletada com sucesso!'
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao deletar: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
}
