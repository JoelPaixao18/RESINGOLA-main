<?php
require_once 'bd.php';

header('Content-Type: application/json');

if (!isset($_GET['userId'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID do usuário não fornecido']);
    exit;
}

$userId = intval($_GET['userId']);

$stmt = $conn->prepare("SELECT * FROM residencia WHERE id = ?");
$stmt->execute([$userId]);
$residencias = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'status' => 'success',
    'residencias' => $residencias
]);
