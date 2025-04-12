<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "resingola";

// Lê o corpo da requisição JSON
$data = json_decode(file_get_contents('php://input'), true);

// Função para validar dados
function validateInput($data, $field, $type = 'string', $min = null, $max = null) {
    if (!isset($data[$field])) {
        return ["status" => "error", "message" => "Campo '$field' é obrigatório"];
    }

    $value = $data[$field];

    switch ($type) {
        case 'number':
            if (!is_numeric($value)) {
                return ["status" => "error", "message" => "'$field' deve ser um número"];
            }
            if ($min !== null && $value < $min) {
                return ["status" => "error", "message" => "'$field' deve ser maior ou igual a $min"];
            }
            if ($max !== null && $value > $max) {
                return ["status" => "error", "message" => "'$field' deve ser menor ou igual a $max"];
            }
            break;

        case 'array':
            if (!is_array($value) || count($value) === 0) {
                return ["status" => "error", "message" => "'$field' deve ser uma lista com pelo menos um item"];
            }
            break;

        case 'string':
            if (empty(trim($value))) {
                return ["status" => "error", "message" => "'$field' não pode estar vazio"];
            }
            break;
    }

    return null;
}

// Campos obrigatórios
$requiredFields = [
    ['imagem', 'string'],
    ['houseSize', 'number', 1],
    ['typology', 'string'],
    ['location', 'string'],
    ['price', 'double', 1],
    ['hasWater', 'boolean'],
    ['hasElectricity', 'boolean'],
    ['roomCount', 'number', 1],
    ['livingRoomCount', 'number', 0],
    ['kitchenCount', 'number', 1],
    ['typeResi', 'string']
];

foreach ($requiredFields as $field) {
    $validation = validateInput($data, $field[0], $field[1], $field[2] ?? null);
    if ($validation) {
        echo json_encode($validation);
        exit;
    }
}

// Validações específicas
if ($data['typology'] === 'Apartamento') {
    $validation = validateInput($data, 'typeResi', 'string');
} else {
    $validation = validateInput($data, 'roomCount', 'number', 1);
    if (!$validation) $validation = validateInput($data, 'livingRoomCount', 'number', 0);
    if (!$validation) $validation = validateInput($data, 'kitchenCount', 'number', 1);
}

if ($validation) {
    echo json_encode($validation);
    exit;
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ADICIONE ESTA LINHA


    $imagem = $data['imagem'];
    $houseSize = $data['houseSize'];
    $typeResi = $data['typeResi'] ?? '';
    $typology = $data['typology'];
    $roomCount = $data['roomCount'] ?? 0;
    $livingRoomCount = $data['livingRoomCount'] ?? 0;
    $kitchenCount = $data['kitchenCount'] ?? 0;
    $hasWater = $data['hasWater'] ?? false;
    $hasElectricity = $data['hasElectricity'] ?? false;
    $location = $data['location'];
    $price = $data['price'];

    $sql = "INSERT INTO residencia (
        imagem, 
        houseSize, 
        typeResi, 
        typology, 
        roomCount, 
        livingRoomCount, 
        kitchenCount, 
        hasWater, 
        hasElectricity, 
        location, 
        price
    ) VALUES (
        :imagem, 
        :houseSize, 
        :typeResi, 
        :typology, 
        :roomCount, 
        :livingRoomCount, 
        :kitchenCount, 
        :hasWater, 
        :hasElectricity, 
        :location, 
        :price
    )";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':imagem', $imagem);
    $stmt->bindParam(':houseSize', $houseSize);
    $stmt->bindParam(':typeResi', $typeResi);
    $stmt->bindParam(':typology', $typology);
    $stmt->bindParam(':roomCount', $roomCount);
    $stmt->bindParam(':livingRoomCount', $livingRoomCount);
    $stmt->bindParam(':kitchenCount', $kitchenCount);
    $stmt->bindParam(':hasWater', $hasWater, PDO::PARAM_BOOL);
    $stmt->bindParam(':hasElectricity', $hasElectricity, PDO::PARAM_BOOL);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':price', $price);

    if ($stmt->execute()) {
        // Recupera o ID da residência inserida
        $residenceId = $conn->lastInsertId();
    
        // Recupera os dados da residência recém-inserida
        $sqlSelect = "SELECT * FROM residencia WHERE id = :id";
        $stmtSelect = $conn->prepare($sqlSelect);
        $stmtSelect->bindParam(':id', $residenceId);
        $stmtSelect->execute();
        $newResidence = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    
        // Retorna os dados da nova residência
        $response = ['status' => 'success', 'message' => 'Residência cadastrada com sucesso', 'data' => $newResidence];
    } else {
        $response = ['status' => 'error', 'message' => 'Erro ao cadastrar residência'];
    }
    

} catch (PDOException $err) {
    echo json_encode(['status' => 'error', 'message' => 'Erro: ' . $err->getMessage()]);
    exit; // <--- ADICIONE ISSO
}

echo json_encode($response); // <--- ADICIONE ISSO