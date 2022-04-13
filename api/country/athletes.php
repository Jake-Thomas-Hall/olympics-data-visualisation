<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';
require __DIR__ . '/../_countryService.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (empty($_GET["id"])) {
        jsonErrorResponse(404, "Id not provided.");
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

    // If gender filter is set, add where clause to filter by that provided gender
    if (isset($_GET['gender'])) {
        if ($_GET['gender'] == 'Men' || $_GET['gender'] == 'Women') {
            $sql = $sql . " WHERE AthleteGender = '{$_GET['gender']}'";
        }
    }

    // If weighted is set, and is true, order results by weighted value instead of by raw medal count
    if (isset($_GET['weighted'])) {
        if ($_GET['weighted'] == true) {
            $sql = $sql . " ORDER BY Weighted DESC";
        }
        else {
            $sql = $sql . " ORDER BY AthleteMedals DESC";
        }
    }
    else {
        $sql = $sql . " ORDER BY AthleteMedals DESC";
    }

    $sql = $sql . " LIMIT 0, 10";

    $countryAthleteMedalQuery = $connection->prepare($sql);

    $countryAthleteMedalQuery->bind_param("i", $_GET["id"]);

    $countryAthleteMedalQuery->execute();

    $result = $countryAthleteMedalQuery->get_result();
    $athletes = $result->fetch_all(MYSQLI_ASSOC);

    jsonResponse("Top 15 athletes by country query succeeded", [
        'athletes' => $athletes,
        'country' => $countryService->getCountryById($_GET["id"])
    ]);
}
