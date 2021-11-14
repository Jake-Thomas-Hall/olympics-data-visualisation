<?php
require __DIR__ . '/_connect.php';

$sql = "SELECT 
(SELECT COUNT(SportID) FROM tbl_sports) as sports, 
(SELECT COUNT(AthleteID) FROM tbl_athletes) as athletes, 
(SELECT COUNT(CountryID) FROM tbl_countries) as countries, 
(SELECT MAX(VenueYear) - MIN(VenueYear) FROM tbl_venues) as years, 
(SELECT COUNT(WinID) FROM tbl_wins) as medals, 
(SELECT COUNT(DisciplineID) FROM tbl_disciplines) as disciplines, 
(SELECT COUNT(EventID) from tbl_events) as events, 
(SELECT COUNT(DISTINCT tbl_venues.VenueCity) FROM tbl_venues) as hostCities;";

if ($result = $connection->query($sql)) {
    $homeResponse = $result->fetch_assoc();

    echo json_encode($homeResponse, JSON_NUMERIC_CHECK);
} else {
    http_response_code(404);
}
