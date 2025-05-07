<?php
header('Content-Type: application/json');
require_once 'db.php';

$testData = [
    'images' => json_encode(['test.jpg']),
    'houseSize' => '100',
    'status' => 'Venda',
    'typeResi' => 'Apartamento',
    'typology' => 'T2',
    'location' => 'Província Luanda, Município Cazenga',
    'latitude' => '-8.827536',
    'longitude' => '13.287826',
    'price' => '150000'
];

try {
    $sql = "INSERT INTO residencia (
        images, houseSize, status, typeResi, typology,
        livingRoomCount, kitchenCount, hasWater, hasElectricity,
        bathroomCount, quintal, andares, garagem, varanda,
        location, latitude, longitude, price
    ) VALUES (
        :images, :houseSize, :status, :typeResi, :typology,
        :livingRoomCount, :kitchenCount, :hasWater, :hasElectricity,
        :bathroomCount, :quintal, :andares, :garagem, :varanda,
        :location, :latitude, :longitude, :price
    )";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($testData);
    
    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}