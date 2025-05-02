<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

function validarNome($nome) {
    $nome = trim($nome);
    return (strlen($nome) >= 3 && preg_match("/^[a-zA-ZÀ-ÿ\s']+$/", $nome));
}

function validarEmail($email) {
    return filter_var(trim($email), FILTER_VALIDATE_EMAIL);
}

function validarTelefoneAngola($tel) {
    $tel = preg_replace('/\D/', '', $tel);
    return (strlen($tel) === 9 && preg_match('/^9/', $tel)); // 9 dígitos começando com 9
}

$data = json_decode(file_get_contents("php://input"));

// Verificação básica
if (!isset($data->id) || !isset($data->nome) || !isset($data->email) || !isset($data->tel)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Todos os campos são obrigatórios']);
    exit;
}

// Validações
$erros = [];
if (!validarNome($data->nome)) {
    $erros['nome'] = 'Nome deve ter pelo menos 3 caracteres (apenas letras e espaços)';
}

if (!validarEmail($data->email)) {
    $erros['email'] = 'Email inválido';
}

if (!validarTelefoneAngola($data->tel)) {
    $erros['tel'] = 'Telefone deve ter 9 dígitos começando com 9 (Ex: 923456789)';
}

if (!empty($erros)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos', 'errors' => $erros]);
    exit;
}

// Sanitização
$id = (int)$data->id;
$nome = htmlspecialchars(trim($data->nome), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($data->email), FILTER_SANITIZE_EMAIL);
$tel = preg_replace('/\D/', '', $data->tel);

try {
    // Verifica se email já existe (outro usuário)
    $stmt = $pdo->prepare("SELECT id FROM usuario WHERE email = ? AND id != ?");
    $stmt->execute([$email, $id]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Este email já está em uso']);
        exit;
    }

    // Atualização
    $stmt = $pdo->prepare("UPDATE usuario SET nome = ?, email = ?, tel = ? WHERE id = ?");
    $stmt->execute([$nome, $email, $tel, $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Perfil atualizado',
            'user' => ['id' => $id, 'nome' => $nome, 'email' => $email, 'tel' => $tel]
        ]);
    } else {
        // Verifica se usuário existe
        $stmt = $pdo->prepare("SELECT id FROM usuario WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'status' => ($stmt->rowCount() > 0) ? 'success' : 'error',
            'message' => ($stmt->rowCount() > 0) 
                ? 'Nenhuma alteração foi necessária' 
                : 'Usuário não encontrado'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro no servidor']);
    error_log("Erro ao atualizar perfil: " . $e->getMessage());
}
?>