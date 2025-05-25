<?php
// Script para corrigir os caminhos das imagens

// Diretórios
$backendUploadsDir = __DIR__ . '/Backend/uploads/';
$uploadsDir = __DIR__ . '/uploads/';

// Garantir que os diretórios existam
if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}
if (!file_exists($backendUploadsDir)) {
    mkdir($backendUploadsDir, 0755, true);
}

// Função para renomear e mover arquivos
function fixImagePaths($dir) {
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..' || $file === 'desktop.ini' || $file === 'upload_image.php' || is_dir($dir . $file)) {
            continue;
        }

        // Remove o prefixo 'uploads' do nome do arquivo
        $newName = str_replace('uploads', '', $file);
        
        // Move para ambos os diretórios
        if (file_exists($dir . $file)) {
            // Copiar para /uploads/
            copy($dir . $file, __DIR__ . '/uploads/' . $newName);
            
            // Renomear no Backend/uploads/
            rename($dir . $file, __DIR__ . '/Backend/uploads/' . $newName);
            
            echo "Arquivo processado: $file -> $newName\n";
        }
    }
}

// Processar arquivos
echo "Iniciando correção dos caminhos das imagens...\n";
fixImagePaths($backendUploadsDir);
echo "Processo concluído!\n"; 