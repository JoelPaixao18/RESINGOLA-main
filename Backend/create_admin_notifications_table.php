<?php
require_once __DIR__ . '/db.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS admin_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        property_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        read_status TINYINT(1) DEFAULT 0,
        FOREIGN KEY (property_id) REFERENCES residencia(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    $pdo->exec($sql);
    echo "Tabela admin_notifications criada com sucesso!";
} catch (PDOException $e) {
    die("Erro ao criar tabela: " . $e->getMessage());
}
?> 