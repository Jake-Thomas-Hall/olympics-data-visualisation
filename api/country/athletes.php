<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';
require __DIR__ . '/../_countryService.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (empty($_GET["id"])) {
        jsonErrorResponse(404, "Id not provided.");
    }

    $countryService = new CountryService($connection);
    
    $countryAthleteMedalQuery = $connection->prepare(<<<SQL
        SELECT A.AthleteID, CONCAT(A.AthleteFirstName, ' ', A.AthleteLastName) as AthleteFullName, A.AthleteGender, COUNT(W.MedalID) as AthleteMedals,
        IFNULL(SUM(W.MedalID = 1), 0) as Golds, 
        IFNULL(SUM(W.MedalID = 2), 0) as Silvers, 
        IFNULL(SUM(W.MedalID = 3), 0) as Bronze 
        FROM tbl_wins W 
        INNER JOIN tbl_athletes A ON W.AthleteID = A.AthleteID 
        WHERE A.CountryID = ?
        GROUP BY A.AthleteID
        ORDER BY AthleteMedals DESC
        LIMIT 0, 15;
    SQL);
    
    $countryAthleteMedalQuery->bind_param("i", $_GET["id"]);
    
    $countryAthleteMedalQuery->execute();
    
    $result = $countryAthleteMedalQuery->get_result();
    $athletes = $result->fetch_all(MYSQLI_ASSOC);
    
    if (count($athletes) < 1) {
        jsonErrorResponse(404, "Country not found.");
    }
    
    jsonResponse("Top 15 athletes by country query succeeded", [
        'athletes' => $athletes,
        'country' => $countryService->getCountryById($_GET["id"])
    ]);
}
