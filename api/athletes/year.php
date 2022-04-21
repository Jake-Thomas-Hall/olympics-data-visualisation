<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (empty($_GET["year"])) {
        jsonErrorResponse(404, "Year not provided.");
    }

    $year = $_GET["year"];

    // Join venues, athletes and countries to wins table, group by venue and country so that count will result in the number of athletes being counted
    $sql = "SELECT C.CountryID, C.CountryName, C.CountryISOalpha2, COUNT(C.CountryID) as TotalAthletes 
                FROM tbl_wins as W 
                    INNER JOIN tbl_venues as V on W.VenueID = V.VenueID 
                    INNER JOIN tbl_athletes as A ON W.AthleteID = A.AthleteID 
                    INNER JOIN tbl_countries as C ON A.CountryID = C.CountryID 
                WHERE V.VenueYear = ? 
                GROUP BY V.VenueID, C.CountryID 
                ORDER BY TotalAthletes DESC";

    $athletesByYearQuery = $connection->prepare($sql);

    $athletesByYearQuery->bind_param("i", $year);

    $athletesByYearQuery->execute();

    $result = $athletesByYearQuery->get_result();
    // Get all athletes, are ordered by total already due to query
    $athletesYearCountry = $result->fetch_all(MYSQLI_ASSOC);

    // Split out top 10 countries
    $top10Countries = array_slice($athletesYearCountry, 0, 10);
    // Get all other countries athletes
    $allOtherCountries = array_slice($athletesYearCountry, 10);

    // Add "other" summary column to display how many athletes there are from other countries
    if (count($athletesYearCountry) > 0) {
        array_push($top10Countries, [
            "CountryID" => 0,
            "CountryName" => "Other",
            "CountryISOalpha2" => "XX",
            "TotalAthletes" => array_sum(array_column($allOtherCountries, 'TotalAthletes'))
        ]);
    }
    
    jsonResponse("Athletes count by year query successful for $year", [
        "topCountries" => $top10Countries,
        "allCountries" => $athletesYearCountry,
        "totalAthletes" => array_sum(array_column($athletesYearCountry, 'TotalAthletes'))
    ]);
}
