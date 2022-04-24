<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sportFilter = "";
    $medalFilter = "";
    $orderFilter = "";

    // Setup sport filter if sport is provided
    if (isset($_GET["sport"])) {
        $sportFilter = "WHERE W.SportID = ?";
        $sport = $_GET["sport"];
    }

    // Setup medal filter if medal is provided
    if (isset($_GET["medal"])) {
        switch ($_GET["medal"]) {
            case 1:
                $medalFilter = "WHERE Golds > 0";
                break;
            case 2:
                $medalFilter = "WHERE Silvers > 0";
                break;
            case 3:
                $medalFilter = "WHERE Bronze > 0";
                break;
            default:
                jsonErrorResponse(400, "Invalid option provided for medal, 1, 2 or 3 expected.");
                break;
        }
    }

    // Setup sport filter if sport is provided
    if (isset($_GET["order"])) {
        switch ($_GET["order"]) {
            case 'Weighting':
                $orderFilter = "ORDER BY Weighting DESC";
                break;
            case 'Medals':
                $medalFilter = "ORDER BY Medals DESC";
                break;
            default:
                jsonErrorResponse(400, "Invalid option provided for order; 'Weighting' or 'Medals' expected.");
                break;
        }
    }

    // Peform subquery which returns sports grouped by year, win type and gender - main query then uses this result to count the number of sports each gender participated in
    $sql = "SELECT AthleteID, AthleteFullName, AthleteGender, CountryName, CountryISOalpha2, Medals, Golds, Silvers, Bronze, (Golds * 3) + (Silvers * 2) + Bronze as Weighting FROM (
                SELECT A.AthleteID, CONCAT(A.AthleteFirstName, ' ', A.AthleteLastName) as AthleteFullName, A.AthleteGender, C.CountryName, C.CountryISOalpha2, COUNT(W.WinID) as Medals, SUM(W.MedalID = 1) as Golds, SUM(W.MedalID = 2) as 	Silvers, SUM(W.MedalID = 3) as Bronze
                FROM tbl_wins as W 
                INNER JOIN tbl_athletes as A ON W.AthleteID = A.AthleteID
                INNER JOIN tbl_countries as C on A.CountryID = C.CountryID
                $sportFilter 
                GROUP BY A.AthleteID
            ) as x
            $medalFilter 
            $orderFilter";

    if (!isset($_GET['page'])) {
        jsonErrorResponse(400, "Page number must be provided (starting from 1) for all athlete list queries.");
    }
    $page = $_GET['page'];

    $limitStart = (25 * $page) - 25;

    $sql = $sql . " LIMIT $limitStart, 26";

    $athleteListQuery = $connection->prepare($sql);
    if (isset($sport)) {
        $athleteListQuery->bind_param("i", $sport);
    }
    $athleteListQuery->execute();
    $result = $athleteListQuery->get_result();
    
    jsonResponse("Athlete list query successful", $result->fetch_all(MYSQLI_ASSOC));
}