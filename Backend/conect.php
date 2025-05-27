<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../Backend/db.php';

// Configurações para upload de imagens
$uploadDir = __DIR__ . '/../Backend/uploads/';
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Criar diretório se não existir
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

try {
    // Verificar se há imagens enviadas
    if (empty($_FILES['images'])) {
        throw new Exception('Nenhuma imagem foi enviada');
    }

    // Processar cada imagem
    $imagePaths = [];
    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
        $fileType = $_FILES['images']['type'][$index];
        $fileSize = $_FILES['images']['size'][$index];
        $errorCode = $_FILES['images']['error'][$index];

        // Verificar erros no upload
        if ($errorCode !== UPLOAD_ERR_OK) {
            throw new Exception('Erro no upload da imagem: ' . $errorCode);
        }

        // Verificar tipo do arquivo
        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception('Tipo de arquivo não permitido: ' . $fileType);
        }

        // Verificar tamanho do arquivo
        if ($fileSize > $maxFileSize) {
            throw new Exception('Arquivo excede o tamanho máximo de 5MB');
        }

        // Gerar nome único para o arquivo
        $extension = pathinfo($_FILES['images']['name'][$index], PATHINFO_EXTENSION);
        $filename = 'img_' . date('YmdHis') . '_' . $index . '.' . $extension;
        $destination = $uploadDir . $filename;

        // Mover arquivo para o diretório de uploads
        if (!move_uploaded_file($tmpName, $destination)) {
            throw new Exception('Falha ao salvar a imagem no servidor');
        }

        $imagePaths[] = $filename;
    }

    if (isset($_POST['description']) && strlen($_POST['description']) > 500) {
        throw new Exception('A descrição não pode exceder 500 caracteres');
    }

    // Obter outros dados do formulário
    $data = [
        'images' => json_encode($imagePaths),
        'houseSize' => $_POST['houseSize'],
        'status' => $_POST['status'],
        'typeResi' => $_POST['typeResi'],
        'typology' => $_POST['typology'],
        'livingRoomCount' => $_POST['livingRoomCount'] ?? 0,
        'kitchenCount' => $_POST['kitchenCount'] ?? 1,
        'hasWater' => $_POST['hasWater'] === 'true' ? 1 : 0,
        'hasElectricity' => $_POST['hasElectricity'] === 'true' ? 1 : 0,
        'bathroomCount' => $_POST['bathroomCount'] ?? 1,
        'quintal' => $_POST['quintal'] === 'true' ? 1 : 0,
        'andares' => $_POST['andares'] ?? 1,
        'garagem' => $_POST['garagem'] === 'true' ? 1 : 0,
        'varanda' => $_POST['varanda'] === 'true' ? 1 : 0,
        'location' => $_POST['location'],
        'latitude' => $_POST['latitude'],
        'longitude' => $_POST['longitude'],
        'price' => $_POST['price'],
        'description' => $_POST['description'] ?? '',
        'user_id' => $_POST['user_id'],
        'approval_status' => 'pendente' // Novo campo
    ];

    // Inserir no banco de dados
    $sql = "INSERT INTO residencia (
        images, houseSize, status, typeResi, typology,
        livingRoomCount, kitchenCount, hasWater, hasElectricity,
        bathroomCount, quintal, andares, garagem, varanda,
        location, latitude, longitude, price, description, user_id, approval_status
    ) VALUES (
        :images, :houseSize, :status, :typeResi, :typology,
        :livingRoomCount, :kitchenCount, :hasWater, :hasElectricity,
        :bathroomCount, :quintal, :andares, :garagem, :varanda,
        :location, :latitude, :longitude, :price, :description, :user_id, :approval_status
    )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);
    $propertyId = $pdo->lastInsertId();

    // Criar notificação para o admin
    $adminNotificationSql = "INSERT INTO admin_notifications (
        type, message, property_id, created_at, read_status
    ) VALUES (
        'new_property',
        :message,
        :property_id,
        NOW(),
        0
    )";

    $notificationMessage = "Novo imóvel cadastrado: " . $data['typeResi'] . " em " . $data['location'] . 
                          " (" . ($data['status'] === 'Venda' ? 'Venda' : 'Arrendamento') . ")";

    $notificationStmt = $pdo->prepare($adminNotificationSql);
    $notificationStmt->execute([
        'message' => $notificationMessage,
        'property_id' => $propertyId
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Imóvel cadastrado com sucesso e está aguardando aprovação',
        'id' => $propertyId
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no cadastro: ' . $e->getMessage()
    ]);
}
?>