<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

$countries = [];

$sql = "SELECT CountryID, CountryName, CountryCode, CountryPopulation, CountryGDP FROM tbl_countries ORDER BY tbl_countries.CountryName";

if ($result = $connection->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        array_push($countries, $row);
    }

    jsonResponse("List countries success", $countries);
}
else {
    jsonErrorResponse(500, "Country list query did not succeed.");
}