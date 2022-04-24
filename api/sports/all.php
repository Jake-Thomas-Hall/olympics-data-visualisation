<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Get all sports, used for option dropdowns in frontend
    $sql = "SELECT SportID, SportType FROM tbl_sports";

    $genderSportParticipationByYearQuery = $connection->query($sql);

    $result = $genderSportParticipationByYearQuery->fetch_all(MYSQLI_ASSOC);
    
    jsonResponse("All sports query successful", $result);
}