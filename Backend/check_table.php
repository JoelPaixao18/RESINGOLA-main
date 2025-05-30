<?php
require_once 'db.php';

try {
    $result = $conn->query("DESCRIBE residencia");
    $fields = $result->fetch_all(MYSQLI_ASSOC);
    
    echo "Estrutura da tabela residencia:\n";
    print_r($fields);
    
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage();
} finally {
    if (isset($conn)) {
        $conn->close();
    }
} 