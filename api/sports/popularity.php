<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Reject request if year option not provided
    if (empty($_GET["year"])) {
        jsonErrorResponse(400, "Year (All, or year, e.g. 1964) not provided.");
    }

    // Reject request if games option not provided
    if (empty($_GET["games"])) {
        jsonErrorResponse(400, "Filter (Summer, Winter) not provided.");
    }

    $year = $_GET["year"];
    $games = $_GET["games"];

    $filter = "";

    // And summer or winter games to filter
    if ($games === 'Summer' || $games === 'Winter') {
        $filter = "WHERE W.WinType = '$games'";
    }

    // If not returning data for sports from all games, add year filter.
    if ($year !== 'All') {
        $filter = $filter . " AND V.VenueYear = ?";
    }

    // Perform query, joins sports and venues, groups by Sport ID then performs count of the number of medals rewarded for that sport, filtering by year 
    // if provided as well
    $sql = "SELECT S.SportID, S.SportType, COUNT(W.WinID) as Medals 
            FROM tbl_wins as W 
            INNER JOIN tbl_sports as S ON W.SportID = S.SportID 
            INNER JOIN tbl_venues as V ON W.VenueID = V.VenueID
            $filter 
            GROUP BY S.SportID
            ORDER BY Medals DESC;";

    $sportPopularityQuery = $connection->prepare($sql);

    if ($year !== 'All') {
        $sportPopularityQuery->bind_param("i", $year);   
    }

    $sportPopularityQuery->execute();

    // Get all rows, each row represents a year, with a count for total sports, mens sports and womens sports
    $result = $sportPopularityQuery->get_result();
    
    jsonResponse("Sports popularity query successful for $games games, $year", $result->fetch_all(MYSQLI_ASSOC));
}