<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // Find all venue years, return as array
    $sql = "SELECT V.VenueYear, V.VenueCity 
            FROM tbl_venues as V 
            GROUP BY V.VenueYear 
            ORDER BY V.VenueYear";

    $allVenueYearsQuery = $connection->query($sql);

    $venueYears = $allVenueYearsQuery->fetch_all(MYSQLI_ASSOC);

    jsonResponse("Venue years query success", $venueYears);
}