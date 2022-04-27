<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Get all country details, along with count of medals and calculation of the population per medal
    $sql = "SELECT C.CountryName, C.CountryPopulation, COUNT(W.WinID) as Medals, C.CountryPopulation / COUNT(W.WinID) as PopulationPerMedal, C.CountryID
            FROM tbl_wins as W
            INNER JOIN tbl_athletes as A ON W.AthleteID = A.AthleteID
            INNER JOIN tbl_countries as C ON A.CountryID = C.CountryID
            WHERE C.CountryPopulation > 0
            GROUP BY C.CountryID
            ORDER BY Medals DESC";

    $perCapitaMedalsQuery = $connection->query($sql);
    
    jsonResponse("Per capita medals query successful", $perCapitaMedalsQuery->fetch_all(MYSQLI_ASSOC));
}