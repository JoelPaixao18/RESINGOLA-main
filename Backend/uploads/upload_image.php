<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Configurações de caminho
$baseDir = realpath(__DIR__ . '/..');
$uploadDir = $baseDir . '/uploads/';
$baseUrl = 'http://192.168.100.66/RESINGOLA-main/uploads/';

// Criar diretório se não existir
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        error_log("Falha ao criar diretório: " . $uploadDir);
        die(json_encode([
            'status' => 'error',
            'message' => 'Erro no servidor ao criar diretório'
        ]));
    }
}

try {
    // Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido', 405);
    }

    // Verificar se imagem foi enviada
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Nenhuma imagem válida recebida', 400);
    }

    $file = $_FILES['image'];
    
    // Validações
    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp'
    ];
    
    if (!array_key_exists($file['type'], $allowedTypes)) {
        throw new Exception('Tipo de arquivo não permitido. Use apenas JPEG, PNG ou WebP', 415);
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        throw new Exception('Arquivo muito grande (tamanho máximo: 5MB)', 413);
    }

    // Gerar nome único para o arquivo
    $fileExt = $allowedTypes[$file['type']];
    $fileName = uniqid('img_') . '.' . $fileExt;
    $targetPath = $uploadDir . $fileName;

    // Mover o arquivo
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Falha ao salvar arquivo', 500);
    }

    // Verificar se arquivo foi criado
    if (!file_exists($targetPath)) {
        throw new Exception('Arquivo não foi criado corretamente', 500);
    }

    // Retornar resposta de sucesso
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'imageUrl' => $baseUrl . rawurlencode($fileName),
        'fileName' => $fileName
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    error_log("ERRO: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>