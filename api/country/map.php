<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $filter = "";

    // Add filter for summer or winter games if provided
    if (isset($_GET["games"])) {
        // Only allow two set values through.
        if ($_GET["games"] === 'Summer' || $_GET["games"] === 'Winter') {
            $filter = "AND W.WinType = '{$_GET["games"]}'";
        }
    }

    // Get all wins with athlete and then country data joined, count medals with filter for summer or winter games (or neither)
    $sql = "SELECT C.CountryID, C.CountryISOalpha2 as id, COUNT(W.WinID) as Medals 
            FROM tbl_wins as W 
            INNER JOIN tbl_athletes as A ON W.AthleteID = A.AthleteID 
            INNER JOIN tbl_countries as C ON A.CountryID = C.CountryID
            WHERE C.CountryISOalpha2 IS NOT NULL $filter 
            GROUP BY C.CountryID
            ORDER BY Medals DESC";

    $genderSportParticipationByYearQuery = $connection->query($sql);

    // Get all rows, each row represents the total medals that country has won
    $result = $genderSportParticipationByYearQuery->fetch_all(MYSQLI_ASSOC);
    
    jsonResponse("Map data query successful", $result);
}