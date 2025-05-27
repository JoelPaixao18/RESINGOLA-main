<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/db.php';
session_start();

// Verificar se é admin
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Acesso negado']);
    exit();
}

try {
    $stmt = $pdo->query("SELECT * FROM residencia WHERE approval_status = 'pendente'");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decodificar imagens JSON
    foreach ($properties as &$property) {
        $property['images'] = json_decode($property['images'], true);
    }

    echo json_encode([
        'status' => 'success',
        'properties' => $properties
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro: ' . $e->getMessage()
    ]);
}
?>