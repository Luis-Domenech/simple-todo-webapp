<?php

declare(strict_types=1);

// Remove cors error by allowing all origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Load all packages from vendor directory and module directory
require_once __DIR__ . '/../vendor/autoload.php';
// require_once __DIR__ . '/modules/hashmap.php';


// Define what we'll be using
use GraphQL\Server\StandardServer;
use GraphQL\Type\Definition\ObjectType;
// use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
// use HashMap\HashMap;

// Load our cache
require_once __DIR__ . '/modules/cache.php';

// Load our resolvers
require __DIR__ . '/resolvers/resolvers.php';


// Here we define an GraphQL Object Type called Query
// All GraphQL schemas must have a Query object with the server's operations defined in it
$queryType = new ObjectType([
    'name' => 'Query',
    'fields' => $queries,
]);

$mutationType = new ObjectType([
    'name' => 'Mutation',
    'fields' => $mutations,
]);

$schema = new Schema([
    'query' => $queryType,
    'mutation' => $mutationType,
]);

$server = new StandardServer([
    'schema' => $schema,
]);

$server->handleRequest();
