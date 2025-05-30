<?php
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/uploads';

$result = [
    'status' => 'checking',
    'checks' => []
];

// Verifica se o diretório existe
if (!file_exists($uploadDir)) {
    $result['checks'][] = [
        'check' => 'Directory exists',
        'status' => 'failed',
        'message' => 'Upload directory does not exist',
        'path' => $uploadDir
    ];
    
    // Tenta criar o diretório
    if (@mkdir($uploadDir, 0777, true)) {
        $result['checks'][] = [
            'check' => 'Directory creation',
            'status' => 'success',
            'message' => 'Upload directory created successfully'
        ];
    } else {
        $result['checks'][] = [
            'check' => 'Directory creation',
            'status' => 'failed',
            'message' => 'Failed to create upload directory'
        ];
    }
} else {
    $result['checks'][] = [
        'check' => 'Directory exists',
        'status' => 'success',
        'message' => 'Upload directory exists',
        'path' => $uploadDir
    ];
}

// Verifica permissões
$perms = substr(sprintf('%o', fileperms($uploadDir)), -4);
$isWritable = is_writable($uploadDir);

$result['checks'][] = [
    'check' => 'Directory permissions',
    'status' => $isWritable ? 'success' : 'failed',
    'message' => $isWritable ? 'Directory is writable' : 'Directory is not writable',
    'current_permissions' => $perms
];

// Lista os arquivos no diretório
if (file_exists($uploadDir)) {
    $files = scandir($uploadDir);
    $files = array_diff($files, array('.', '..'));
    
    $result['checks'][] = [
        'check' => 'Directory contents',
        'status' => 'info',
        'message' => count($files) . ' files found',
        'files' => array_values($files)
    ];
}

// Define o status final
$result['status'] = 'completed';

echo json_encode($result, JSON_PRETTY_PRINT);
?> 