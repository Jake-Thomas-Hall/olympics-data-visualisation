<?php
require __DIR__ . '/../_connect.php';

$country;
$stmt = $connection->prepare("SELECT C.CountryID, C.CountryName, C.CountryCode, C.CountryPopulation, C.CountryGDP, COUNT(W.MedalID) as Medals, IFNULL(SUM(W.MedalID = 1), 0) as Golds, IFNULL(SUM(W.MedalID = 2), 0) as Silvers, IFNULL(SUM(W.MedalID = 3), 0) as Bronze FROM tbl_wins W LEFT JOIN tbl_athletes A ON W.AthleteID = A.AthleteID LEFT JOIN tbl_countries C on A.CountryID = C.CountryID WHERE C.CountryID = ?");

if (empty($_GET["id"])) {
    http_response_code(404);
    die;
}

$stmt->bind_param("i", $_GET["id"]);
$stmt->execute();

$result = $stmt->get_result();
$country = $result->fetch_assoc();

if (empty($country["CountryID"])) {
    http_response_code(404);
    die;
}

echo json_encode($country, JSON_NUMERIC_CHECK);