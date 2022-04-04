<?php

// Return a standard 200 response for successful queries/commands etc
// Data object can be provided, which will also be encoded into the response.
function jsonResponse(string $message = "", $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'message' => $message,
        'data' => $data
    ], JSON_NUMERIC_CHECK);
    die;
}

// Return as error with the specified code, messagge and data.
function jsonErrorResponse(int $code, string $message = "", $data = null) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode([
        'message' => $message,
        'data' => $data
    ], JSON_NUMERIC_CHECK);
    die;
}