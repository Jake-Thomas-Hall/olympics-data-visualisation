<?php

class CountryService {
    private mysqli $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function getCountryById(int $countryId): array {
        $countryQuery = $this->connection->prepare("SELECT CountryId, CountryName, CountryCode, CountryPopulation, CountryGDP FROM `tbl_countries` WHERE CountryID = ?;");
        $countryQuery->bind_param("i", $countryId);
        $countryQuery->execute();

        $result = $countryQuery->get_result();
        return $result->fetch_assoc();
    }
}