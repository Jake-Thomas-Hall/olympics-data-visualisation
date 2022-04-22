<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Reject request if games option not provided
    if (empty($_GET["games"])) {
        jsonErrorResponse(400, "Filter (Summer, Winter) not provided.");
    }

    $filter = "";

    // In the case of this query, must filter by summer or winter games to get accurate result.
    if (isset($_GET["games"])) {
        // Only allow two set values through.
        if ($_GET["games"] === 'Summer' || $_GET["games"] === 'Winter') {
            $filter = "WHERE WinType = '{$_GET["games"]}'";
        }
    }

    // Peform subquery which returns sports grouped by year, win type and gender - main query then uses this result to count the number of sports each gender participated in
    $sql = "SELECT VenueYear, COUNT(DISTINCT SportID) as TotalSports, SUM(AthleteGender = 'Women') as Women, SUM(AthleteGender = 'Men') as Men 
            FROM ( 
                SELECT V.VenueYear, A.AthleteGender, S.SportID, W.WinType 
                FROM tbl_sports as S 
                INNER JOIN tbl_wins as W on S.SportID = W.SportID 
                INNER JOIN tbl_venues as V on W.VenueID = V.VenueID 
                INNER JOIN tbl_athletes as A on W.AthleteID = A.AthleteID 
                GROUP BY V.VenueYear, W.WinType, S.SportID, A.AthleteGender 
            ) as x 
            $filter 
            GROUP BY VenueYear 
            ORDER BY VenueYear";

    $genderSportParticipationByYearQuery = $connection->query($sql);

    // Get all rows, each row represents a year, with a count for total sports, mens sports and womens sports
    $result = $genderSportParticipationByYearQuery->fetch_all(MYSQLI_ASSOC);
    
    jsonResponse("Sports participation by gender by year query successful for {$_GET["games"]} games", $result);
}