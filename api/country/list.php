<?php
require __DIR__ . '/../_connect.php';
require __DIR__ . '/../_utilities.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") { 
    $countries = [];

    $sql = "SELECT CountryID, CountryName, CountryCode, CountryPopulation, CountryGDP, CountryISOalpha2 FROM tbl_countries";

    if (isset($_GET["filter"])) {
        $param = "%{$_GET["filter"]}%";
        $sql = $sql . " WHERE CountryName LIKE ? OR CountryCode LIKE ? ORDER BY CountryName;";
        $countryResultFiltered = $connection->prepare($sql);
        $countryResultFiltered->bind_param("ss", $param, $param);
        $countryResultFiltered->execute();
        
        $result = $countryResultFiltered->get_result();

        $countries = $result->fetch_all(MYSQLI_ASSOC);

        jsonResponse("List countries filtered success", $countries);
    }
    else {
        $sql = $sql . " ORDER BY tbl_countries.CountryName";

        if ($result = $connection->query($sql)) {
            $countries = $result->fetch_all(MYSQLI_ASSOC);
        
            jsonResponse("List countries success", $countries);
        }
        else {
            jsonErrorResponse(500, "Country list query did not succeed.");
        }
    }
}
