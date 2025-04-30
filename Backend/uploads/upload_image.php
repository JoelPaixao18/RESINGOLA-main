<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

try {
    if (empty($_FILES['image'])) {
        throw new Exception('Nenhuma imagem enviada');
    }

    // Configurações do upload
    $uploadDir = __DIR__ . '/uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileName = uniqid('img_') . '.jpg';
    $filePath = $uploadDir . $fileName;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
        throw new Exception('Falha ao salvar a imagem');
    }

    // Retornar URL completa da imagem
    $baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/RESINGOLA-main/Backend/uploads/';
    echo json_encode([
        'status' => 'success',
        'imageUrl' => $baseUrl . $fileName,
        'fileName' => $fileName
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
exit;