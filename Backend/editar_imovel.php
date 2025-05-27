<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

error_log("Iniciando editar_imovel.php");
error_log("POST recebido: " . print_r($_POST, true));
error_log("FILES recebido: " . print_r($_FILES, true));

require_once 'db.php';

function processImage($file, $uploadDir) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    
    error_log("Processando imagem: " . print_r($file, true));
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
        error_log("Diretório de upload criado: " . $uploadDir);
    }
    
    if (!is_writable($uploadDir)) {
        chmod($uploadDir, 0777);
        error_log("Permissões do diretório atualizadas");
    }
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Tipo de arquivo não permitido: ' . $file['type']);
    }
    
    if ($file['size'] > $maxFileSize) {
        throw new Exception('Arquivo muito grande (máximo 5MB): ' . $file['size'] . ' bytes');
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = 'img_' . date('YmdHis') . '_' . uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $newFileName;
    
    error_log("Tentando salvar imagem em: " . $targetPath);
    
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        $error = error_get_last();
        throw new Exception('Erro ao salvar imagem. Detalhes: ' . ($error ? $error['message'] : 'Erro desconhecido'));
    }
    
    error_log("Imagem salva com sucesso em: " . $targetPath);
    return $newFileName;
}

try {
    if (!isset($_POST['id'])) {
        throw new Exception('ID do imóvel não fornecido');
    }

    $id = $_POST['id'];
    $uploadDir = 'Uploads/';
    $pdo->beginTransaction();

    $updateData = [
        'typeResi' => $_POST['tipo'] ?? null,
        'price' => $_POST['preco'] ?? null,
        'location' => $_POST['localizacao'] ?? null,
        'latitude' => $_POST['latitude'] ?? null,
        'longitude' => $_POST['longitude'] ?? null,
        'houseSize' => $_POST['area'] ?? null,
        'status' => $_POST['status'] ?? null,
        'typology' => $_POST['typology'] ?? null,
        'livingRoomCount' => $_POST['livingRoomCount'] ?? null,
        'kitchenCount' => $_POST['kitchenCount'] ?? null,
        'bathroomCount' => $_POST['bathroomCount'] ?? null,
        'andares' => $_POST['andares'] ?? null,
        'hasWater' => ($_POST['hasWater'] ?? '0') === '1' ? 'Sim' : 'Não',
        'hasElectricity' => ($_POST['hasElectricity'] ?? '0') === '1' ? 'Sim' : 'Não',
        'quintal' => ($_POST['quintal'] ?? '0') === '1' ? 'Sim' : 'Não',
        'garagem' => ($_POST['garagem'] ?? '0') === '1' ? 'Sim' : 'Não',
        'varanda' => ($_POST['varanda'] ?? '0') === '1' ? 'Sim' : 'Não',
        'description' => $_POST['descricao'] ?? null,
    ];
    
    error_log("Dados recebidos do frontend: " . print_r($_POST, true));
    error_log("Dados para atualização após processamento: " . print_r($updateData, true));
    
    $updateData = array_filter($updateData, function($value) {
        return $value !== null;
    });
    
    $setClauses = [];
    $params = [];
    foreach ($updateData as $key => $value) {
        $setClauses[] = "`$key` = :$key";
        $params[":$key"] = $value;
    }
    
    $sql = "UPDATE residencia SET " . implode(', ', $setClauses) . " WHERE id = :id";
    $params[':id'] = $id;
    
    error_log("Query SQL: " . $sql);
    error_log("Parâmetros: " . print_r($params, true));
    
    $stmt = $pdo->prepare($sql);
    if (!$stmt) {
        throw new Exception("Erro ao preparar query: " . print_r($pdo->errorInfo(), true));
    }
    
    if (!$stmt->execute($params)) {
        throw new Exception("Erro ao executar query: " . print_r($stmt->errorInfo(), true));
    }
    
    $newImages = [];
    if (isset($_FILES['new_images']) && !empty($_FILES['new_images']['name']) && is_array($_FILES['new_images']['name'])) {
        error_log("Processando novas imagens: " . print_r($_FILES['new_images'], true));
        foreach ($_FILES['new_images']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['new_images']['error'][$key] === UPLOAD_ERR_OK) {
                $imageFile = [
                    'name' => $_FILES['new_images']['name'][$key],
                    'type' => $_FILES['new_images']['type'][$key],
                    'tmp_name' => $tmp_name,
                    'error' => $_FILES['new_images']['error'][$key],
                    'size' => $_FILES['new_images']['size'][$key],
                ];
                try {
                    $newImageName = processImage($imageFile, $uploadDir);
                    $newImages[] = $newImageName;
                    error_log("Imagem processada com sucesso: " . $newImageName);
                } catch (Exception $e) {
                    error_log("Erro ao processar imagem {$key}: " . $e->getMessage());
                    continue;
                }
            } else {
                error_log("Erro no upload da imagem {$key}: " . $_FILES['new_images']['error'][$key]);
            }
        }
    } else {
        error_log("Nenhuma nova imagem enviada ou formato inválido.");
    }
    
    $existingImages = [];
    if (isset($_POST['existing_images']) && !empty($_POST['existing_images'])) {
        $existingImages = is_array($_POST['existing_images'])
            ? array_map('trim', array_filter($_POST['existing_images']))
            : array_map('trim', array_filter(explode(',', $_POST['existing_images'])));
    }
    
    error_log("Imagens existentes após processamento: " . print_r($existingImages, true));
    error_log("Novas imagens após processamento: " . print_r($newImages, true));
    
    $allImages = array_merge($existingImages, $newImages);
    $allImages = array_unique(array_filter($allImages));
    
    error_log("Todas as imagens após combinação: " . print_r($allImages, true));
    
    if (!empty($allImages)) {
        $imagesStr = implode(',', $allImages);
        error_log("String de imagens para salvar no banco: " . $imagesStr);
        $stmt = $pdo->prepare("UPDATE residencia SET images = :images WHERE id = :id");
        if (!$stmt) {
            throw new Exception("Erro ao preparar query de imagens: " . print_r($pdo->errorInfo(), true));
        }
        if (!$stmt->execute([':images' => $imagesStr, ':id' => $id])) {
            throw new Exception("Erro ao atualizar imagens: " . print_r($stmt->errorInfo(), true));
        }
        error_log("Imagens atualizadas com sucesso no banco de dados");
    } else {
        $stmt = $pdo->prepare("UPDATE residencia SET images = NULL WHERE id = :id");
        if (!$stmt->execute([':id' => $id])) {
            throw new Exception("Erro ao limpar imagens: " . print_r($stmt->errorInfo(), true));
        }
        error_log("Nenhuma imagem para atualizar, campo definido como NULL");
    }
    
    $pdo->commit();
    
    $stmt = $pdo->prepare("SELECT * FROM residencia WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $updatedProperty = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($updatedProperty && !empty($updatedProperty['images'])) {
        $images = explode(',', $updatedProperty['images']);
        $processedImages = array_map(function($img) use ($uploadDir) {
            $img = trim($img);
            return $img; // Retorna apenas o nome do arquivo
        }, $images);
        $updatedProperty['images'] = array_filter($processedImages);
        error_log("Imagens processadas para resposta: " . print_r($updatedProperty['images'], true));
    } else {
        $updatedProperty['images'] = [];
        error_log("Nenhuma imagem encontrada para o imóvel");
    }
    
    error_log("Resposta final para o frontend: " . print_r($updatedProperty, true));
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Imóvel atualizado com sucesso',
        'property' => $updatedProperty,
    ]);
    
} catch (Exception $e) {
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    $errorMessage = $e->getMessage();
    error_log("Erro completo: " . $errorMessage);
    echo json_encode([
        'status' => 'error',
        'message' => $errorMessage,
    ]);
}