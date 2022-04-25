<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Reject request if id not provided
    if (empty($_GET["id"])) {
        jsonErrorResponse(400, "An id must be provided");
    }

    // Get all athlete medals, with country, venue and medal details 
    $sql = "SELECT A.AthleteID, CONCAT(A.AthleteFirstName, ' ', A.AthleteLastName) as AthleteFullName, A.AthleteGender, C.CountryName, C.CountryID, C.CountryISOalpha2, V.VenueYear, V.VenueCity, W.WinType, M.MedalType, S.SportType 
            FROM tbl_wins as W 
            INNER JOIN tbl_athletes as A ON W.AthleteID = A.AthleteID 
            INNER JOIN tbl_countries as C ON A.CountryID = C.CountryID
            INNER JOIN tbl_venues as V ON W.VenueID = V.VenueID
            INNER JOIN tbl_medals as M ON W.MedalID = M.MedalID
            INNER JOIN tbl_sports as S ON W.SportID = S.SportID 
            WHERE A.AthleteID = ?
            ORDER BY VenueYear DESC";

    $athleteDetailQuery = $connection->prepare($sql);
    $athleteDetailQuery->bind_param("i", $_GET["id"]);
    $athleteDetailQuery->execute();

    $result = $athleteDetailQuery->get_result();
    
    jsonResponse("Athlete details query successful for athlete Id {$_GET["id"]}", $result->fetch_all(MYSQLI_ASSOC));
}