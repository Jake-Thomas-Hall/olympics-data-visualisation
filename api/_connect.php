<?php
$dbPassword = "vKPzgiu4QR0gqYDK";
$dbUserName = "ws326200-odm";
$dbServer = "localhost";
$dbName = "ws326200-odm";

$connection = new mysqli($dbServer, $dbUserName, $dbPassword, $dbName);

if ($connection->connect_errno) {
    exit("Database connection failed. Reason:".$connection->connect_error);
}