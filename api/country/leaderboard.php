<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';
require __DIR__ . '/../_countryService.php';

// This is some of the most braindead code I've ever written, I'm sure there must be a better way to do this than two separate queries, but it's 1:30am and I'm beyond the 
// point of rationality
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Reject request if year isn't provided
    if (empty($_GET["year"])) {
        jsonErrorResponse(400, "Year not provided.");
    }

    $year = $_GET["year"];

    // Query parts, used to build full query
    $summerFilter = " WHERE W.WinType = 'Summer'";
    $winterFilter = " WHERE W.WinType = 'Winter'";
    $yearFilter = " AND V.VenueYear = ?";
    $groupOrder = " GROUP BY C.CountryID ORDER BY Weighted DESC";

    // Fetch all countries, by summer or winter, filtered by year if present
    $sql = "SELECT C.CountryID, C.CountryName, C.CountryISOalpha2, COUNT(W.WinID) as Medals, COUNT(W.MedalID = 1) as Golds, COUNT(W.MedalID = 2) as Silvers, COUNT(W.MedalID = 3) as Bronze, (COUNT(W.MedalID = 1) * 3) + COUNT(W.MedalID = 2) * 2 + COUNT(W.MedalID = 3) as Weighted 
            FROM tbl_wins as W
            INNER JOIN tbl_athletes as A ON W.AthleteID = A.AthleteID
            INNER JOIN tbl_countries as C ON A.CountryID = C.CountryID
            INNER JOIN tbl_venues as V ON W.VenueID = V.VenueID";

    // Build queries, add in year filter if year is not 'All'
    if ($year === 'All') {
        $sqlSummer = $sql . $summerFilter . $groupOrder;
        $sqlWinter = $sql . $winterFilter . $groupOrder;
    }
    else {
        $sqlSummer = $sql . $summerFilter . $yearFilter . $groupOrder;
        $sqlWinter = $sql . $winterFilter . $yearFilter . $groupOrder;
    }
    
    // Prepare
    $leaderboardSummerQuery = $connection->prepare($sqlSummer);
    $leaderboardWinterQuery = $connection->prepare($sqlWinter);

    // Only bind the year if year is not 'All'
    if ($year !== 'All') {
        $leaderboardSummerQuery->bind_param("i", $year);
        $leaderboardWinterQuery->bind_param("i", $year);
    }

    // Fetch all results for both queries, one at a time since it seems PHP absolutely hates trying to have multiple active result sets...
    $leaderboardSummerQuery->execute();

    $summerResult = $leaderboardSummerQuery->get_result();
    $summerLeaderboard = $summerResult->fetch_all(MYSQLI_ASSOC);

    $leaderboardWinterQuery->execute();

    $winterResult = $leaderboardWinterQuery->get_result();
    $winterLeaderboard = $winterResult->fetch_all(MYSQLI_ASSOC);

    jsonResponse("Leaderboard get successful", [
        'summer' => $summerLeaderboard,
        'winter' => $winterLeaderboard
    ]);
}