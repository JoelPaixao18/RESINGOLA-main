<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once 'db.php';

error_log("=== UPLOAD_IMAGE.PHP DEBUG ===");

$response = array();
$uploadDir = __DIR__ . '/uploads/';
error_log("Upload Directory: " . $uploadDir);

// Cria o diretório de uploads se não existir
if (!is_dir($uploadDir)) {
    error_log("Criando diretório de uploads...");
    if (mkdir($uploadDir, 0777, true)) {
        error_log("Diretório criado com sucesso");
    } else {
        error_log("ERRO ao criar diretório");
    }
}

try {
    error_log("FILES array: " . print_r($_FILES, true));
    
    if (!isset($_FILES['images'])) {
        throw new Exception("Nenhuma imagem foi enviada");
    }

    $uploadedImages = $_FILES['images'];
    $savedImages = array();

    // Processa cada imagem enviada
    foreach ($uploadedImages['tmp_name'] as $key => $tmp_name) {
        error_log("Processando imagem $key:");
        error_log("Nome original: " . $uploadedImages['name'][$key]);
        error_log("Tipo: " . $uploadedImages['type'][$key]);
        error_log("Tamanho: " . $uploadedImages['size'][$key]);
        
        if ($uploadedImages['error'][$key] === UPLOAD_ERR_OK) {
            $fileName = $uploadedImages['name'][$key];
            $fileType = $uploadedImages['type'][$key];
            
            // Verifica o tipo do arquivo
            if (!in_array($fileType, ['image/jpeg', 'image/png', 'image/gif'])) {
                error_log("ERRO: Tipo de arquivo não permitido: " . $fileType);
                continue;
            }

            // Gera um nome único para a imagem
            $extension = pathinfo($fileName, PATHINFO_EXTENSION);
            $newFileName = 'img_' . date('YmdHis') . '_' . $key . '.' . $extension;
            $targetPath = $uploadDir . $newFileName;
            
            error_log("Novo nome do arquivo: " . $newFileName);
            error_log("Caminho de destino: " . $targetPath);

            // Move o arquivo para o diretório de uploads
            if (move_uploaded_file($tmp_name, $targetPath)) {
                error_log("Arquivo movido com sucesso");
                chmod($targetPath, 0644); // Define permissões de leitura/escrita
                $savedImages[] = $newFileName; // Salva apenas o nome do arquivo
            } else {
                error_log("ERRO ao mover arquivo: " . error_get_last()['message']);
            }
        } else {
            error_log("ERRO no upload: " . $uploadedImages['error'][$key]);
        }
    }

    if (empty($savedImages)) {
        throw new Exception("Nenhuma imagem foi salva com sucesso");
    }

    error_log("Imagens salvas: " . print_r($savedImages, true));
    
    $response['status'] = 'success';
    $response['message'] = 'Imagens enviadas com sucesso';
    $response['images'] = $savedImages;

} catch (Exception $e) {
    error_log("ERRO: " . $e->getMessage());
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?> 