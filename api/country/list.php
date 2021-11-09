<?php
require __DIR__ . '/../_connect.php';

$countries = [];

$sql = "SELECT CountryID, CountryName, CountryCode, CountryPopulation, CountryGDP FROM tbl_countries;";

if ($result = $connection->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        array_push($countries, $row);
    }

    echo json_encode($countries);
}
else {
    http_response_code(404);
}