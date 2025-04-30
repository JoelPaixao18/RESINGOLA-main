<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../Backend/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nome) && !empty($data->email) && !empty($data->BI) && !empty($data->tel) && !empty($data->senha)) {
    // Validação do nome (mínimo 3 caracteres, apenas letras e espaços)
    if (!preg_match("/^[a-zA-ZÀ-ÿ\s]{3,}$/", $data->nome)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Nome inválido. Deve conter pelo menos 3 caracteres e apenas letras'
        ]);
        exit;
    }

    // Validação do email
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Formato de email inválido'
        ]);
        exit;
    }

    // Validação do BI (formato angolano: 1234567LA123 ou similar)
    if (!preg_match("/^\d{9}[A-Za-z]{2}\d{3}$/", $data->BI)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Número de BI inválido. Formato esperado: 123456789LA123'
        ]);
        exit;
    }

    // Validação do telefone (formato angolano: 9xxxxxxxx)
    if (!preg_match("/^9\d{8}$/", $data->tel)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Número de telefone inválido. Deve começar com 9 e ter 9 dígitos'
        ]);
        exit;
    }

    // Validação da senha (mínimo 6 caracteres)
    if (strlen($data->senha) < 6) {
        echo json_encode([
            'status' => 'error',
            'message' => 'A senha deve ter pelo menos 6 caracteres'
        ]);
        exit;
    }

    // Verificar se as senhas coincidem
    if ($data->senha !== $data->confirmSenha) {
        echo json_encode([
            'status' => 'error',
            'message' => 'As senhas não coincidem'
        ]);
        exit;
    }

    // Verificar se o email já existe
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE email = ?");
    $stmt->execute([$data->email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Este email já está em uso'
        ]);
        exit;
    }

    // Hash da senha
    $senha_hash = password_hash($data->senha, PASSWORD_DEFAULT);

    // Inserir no banco de dados
    $stmt = $pdo->prepare("INSERT INTO usuario (nome, email, BI, tel, senha) VALUES (?, ?, ?, ?, ?)");
    if ($stmt->execute([$data->nome, $data->email, $data->BI, $data->tel, $senha_hash])) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Usuário cadastrado com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao cadastrar usuário'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos os campos são obrigatórios'
    ]);
}
?>