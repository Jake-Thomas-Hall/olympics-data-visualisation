<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';
require __DIR__ . '/../_countryService.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (empty($_GET["id"])) {
        jsonErrorResponse(400, "Id not provided.");
    }

    $countryService = new CountryService($connection);

    // Perform query within subquery, so that alias values can be interacted with in the SELECT statement
    $sql = "SELECT AthleteID, AthleteFullName, AthleteGender, AthleteMedals, Golds, Silvers, Bronze, (Golds * 3) + (Silvers * 2) + Bronze as Weighted 
    FROM ( 
        SELECT A.AthleteID, CONCAT(A.AthleteFirstName, ' ', A.AthleteLastName) as AthleteFullName, A.AthleteGender, COUNT(W.MedalID) as AthleteMedals, IFNULL(SUM(W.MedalID = 1), 0) as Golds, IFNULL(SUM(W.MedalID = 2), 0) as Silvers, IFNULL(SUM(W.MedalID = 3), 0) as Bronze 
        FROM tbl_wins W INNER JOIN tbl_athletes A ON W.AthleteID = A.AthleteID 
        WHERE A.CountryID = ? 
        GROUP BY A.AthleteID
    ) as x";
    $queryOptions = "";
    $limit = "";

    // If gender filter is set, add where clause to filter by that provided gender
    if (isset($_GET['gender'])) {
        if ($_GET['gender'] == 'Men' || $_GET['gender'] == 'Women') {
            $queryOptions = $queryOptions . " WHERE AthleteGender = '{$_GET['gender']}'";
        }
    }

    if (isset($_GET['all'])) {
        // If 'all' is set, return based on page number
        // Return error if page number isn't set.
        if (!isset($_GET['page'])) {
            jsonErrorResponse(400, "Page number must be provided (starting from 1) for all athletes queries.");
        }
        $page = $_GET['page'];

        $limitStart = (25 * $page) - 25;

        $limit = " LIMIT $limitStart, 25";

        // Replicate normal query, but only with necessary parts in order to get a total.
        $sqlTotalResults = "SELECT COUNT(*) as Total 
            FROM ( 
                SELECT A.AthleteID, A.AthleteGender
                FROM tbl_wins W INNER JOIN tbl_athletes A ON W.AthleteID = A.AthleteID 
                WHERE A.CountryID = ? 
                GROUP BY A.AthleteID
            ) as x";
        
        $sqlTotalResults = $sqlTotalResults . $queryOptions;
        $totalResultsNumQuery = $connection->prepare($sqlTotalResults);
        $totalResultsNumQuery->bind_param("i", $_GET["id"]);
        $totalResultsNumQuery->execute();
        $totalResultsNumQuery->store_result();
        $totalResultsNumQuery->bind_result($total);
        $totalResultsNumQuery->fetch();
    }
    else {
        // Set limit, only return top 10 by default
        $limit = " LIMIT 0, 10";
    }

    // If weighted is set, and is true, order results by weighted value instead of by raw medal count
    if (isset($_GET['weighted'])) {
        if ($_GET['weighted'] == true) {
            $queryOptions = $queryOptions . " ORDER BY Weighted DESC";
        }
        else {
            $queryOptions = $queryOptions . " ORDER BY AthleteMedals DESC";
        }
    }
    else {
        $queryOptions = $queryOptions . " ORDER BY AthleteMedals DESC";
    }
    
    $sql = $sql . $queryOptions . $limit;

    $countryAthleteMedalQuery = $connection->prepare($sql);

    $countryAthleteMedalQuery->bind_param("i", $_GET["id"]);

    $countryAthleteMedalQuery->execute();

    $result = $countryAthleteMedalQuery->get_result();
    $athletes = $result->fetch_all(MYSQLI_ASSOC);

    if (isset($_GET['all'])) {
        jsonResponse("Top athletes query, page $page successful", [
            'athletes' => $athletes,
            'country' => $countryService->getCountryById($_GET["id"]),
            'total' => $total
        ]);
    }
    else {
        jsonResponse("Top 10 athletes by country query succeeded", [
            'athletes' => $athletes,
            'country' => $countryService->getCountryById($_GET["id"])
        ]);
    }
}
