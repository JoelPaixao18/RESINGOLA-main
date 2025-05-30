<?php
require_once 'AGVRR/Config/conection.php';

try {
    $stmt = $conn->query("DESCRIBE residencia");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Estrutura da tabela residencia:\n";
    print_r($columns);
    
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?> 