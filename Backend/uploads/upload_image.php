<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$uploadDir = '../uploads/'; // Pasta onde as imagens serão salvas
$baseUrl = 'http://192.168.111.25/RESINGOLA-main/uploads/'; // URL pública

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        echo json_encode(['status' => 'error', 'message' => 'Nenhuma imagem enviada']);
        exit;
    }

    $file = $_FILES['file'];
    $fileName = uniqid() . "_" . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    // Verifica se a pasta existe, senão cria
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $imageUrl = $baseUrl . $fileName;
        echo json_encode(['status' => 'success', 'imageUrl' => $imageUrl]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao mover a imagem']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método não suportado']);
}
