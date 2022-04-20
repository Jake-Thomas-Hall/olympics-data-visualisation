<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") { 
    $country;
    $stmt;
    
    $stmt = $connection->prepare(<<<SQL
        SELECT C.CountryID, C.CountryName, C.CountryCode, C.CountryPopulation, C.CountryGDP, C.CountryISOalpha2, 
        COUNT(W.MedalID) as Medals, 
        IFNULL(SUM(W.MedalID = 1), 0) as Golds, 
        IFNULL(SUM(W.MedalID = 2), 0) as Silvers, 
        IFNULL(SUM(W.MedalID = 3), 0) as Bronze 
        FROM tbl_wins W LEFT JOIN tbl_athletes A ON W.AthleteID = A.AthleteID LEFT JOIN tbl_countries C on A.CountryID = C.CountryID 
        WHERE C.CountryID = ?
    SQL);
    
    if (!empty($_GET['type'])) {
        $stmt = $connection->prepare(<<<SQL
        SELECT C.CountryID, C.CountryName, C.CountryCode, C.CountryPopulation, C.CountryGDP, C.CountryISOalpha2, 
        COUNT(W.MedalID) as Medals, 
        IFNULL(SUM(W.MedalID = 1), 0) as Golds, 
        IFNULL(SUM(W.MedalID = 2), 0) as Silvers, 
        IFNULL(SUM(W.MedalID = 3), 0) as Bronze 
        FROM tbl_wins W LEFT JOIN tbl_athletes A ON W.AthleteID = A.AthleteID LEFT JOIN tbl_countries C on A.CountryID = C.CountryID 
        WHERE C.CountryID = ? AND W.WinType = ?
    SQL);
    }
    
    if (empty($_GET["id"])) {
        jsonErrorResponse(404, "Id not provided.");
    }
    
    if (!empty($_GET["type"])) {
        $stmt->bind_param("is", $_GET["id"], $_GET["type"]);
    }
    else {
        $stmt->bind_param("i", $_GET["id"]);
    }
    
    $stmt->execute();
    
    $result = $stmt->get_result();
    $country = $result->fetch_assoc();
    
    if (empty($country["CountryID"])) {
        jsonErrorResponse(404, "Country not found.");
    }
    
    jsonResponse("Country medal summary query succeeded", $country);
}
