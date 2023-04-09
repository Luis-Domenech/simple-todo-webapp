<?php

// Here we setup a global variable cache and have functions
// to work with the cache.

// Since server loads hashmap.php and this is loaded in server, we don't need to require the hashmap.php file here
// We already have access to it.
use HashMap\HashMap;

require __DIR__ . '/../modules/hashmap.php';

// The cache is a HashMap from IP address to an array, where each element is a task string and it's corresponding done done boolean as it's value
// $cache = new HashMap("String", "Array");

$GLOBALS['cache'] = new HashMap("String", "Array");
// $GLOBALS['cache'] = array();

function get_cache() {
    // If referencing the global cache, must use global keyword
    // global $cache;
    $cache = unserialize(file_get_contents(__DIR__ . '/cache.bin'));

    if (isset($cache) == false) {
        $cache = array();
    }
    
    return $cache;
}

function get_tasks($ip) {
    // global $cache;
    
    return $GLOBALS['cache']->getOrDefault($ip, array());

    // $cache = unserialize(file_get_contents(__DIR__ . '/cache.bin'));

    // if (isset($cache) == false) {
    //     $cache = array();
    // }

    // if (isset($cache[$ip]) == false) {
    //     $cache[$ip] = array();
    // }

    // return $cache[$ip];
}

function load_cache($ip) {
    // global $cache;
    
    return $GLOBALS['cache']->getOrDefault($ip, array());

    // if (isset($GLOBALS['cache']) == false) {
    //     $GLOBALS['cache'] = array();
    // }

    // if (isset($GLOBALS['cache'][$ip]) == false) {
    //     $GLOBALS['cache'][$ip] = array();
    // }
}

// Takes an IP and adds a task to the task array associated to $ip
function add_task($ip, $task) {
    // global $cache;


    // Gets tasks array for $ip or defaults to empty array if none exists
    $ip_tasks = $GLOBALS['cache']->getOrDefault($ip, array());
    // $ip_tasks = get_tasks($ip);

    // Now we add the new task to the array and set it's value for that task to
    // false since usually we added incomplete tasks to a todo list
    $ip_tasks[$task] = false;
    // array_push($ip_tasks, [$task => false]);
    // print_r($ip_tasks);

    // Now we overwrite the array in the hashmap with our new tasks array
    $GLOBALS['cache']->put($ip, $ip_tasks);

    // $cache = get_cache();

    // if (isset($cache[$ip])) {
    //     $cache = array();
    // }

    // $cache[$ip][$task] = false;

    // file_put_contents(__DIR__ . '/cache.bin', serialize($cache));
}

function remove_task($ip, $task) {
    // global $cache;

    // Gets tasks array for $ip or defaults to empty array if none exists
    $ip_tasks = $GLOBALS['cache']->getOrDefault($ip, array());

    // Now we remove the tasks from the array
    // unset($ip_tasks, $ip_tasks[$task]);
    unset($ip_tasks[$task]);

    // Now we overwrite the array in the hashmap with our new tasks array
    $GLOBALS['cache']->put($ip, $ip_tasks);
}

function check_task($ip, $task) {
    // global $cache;

    // Gets tasks array for $ip or defaults to empty array if none exists
    $ip_tasks = $GLOBALS['cache']->getOrDefault($ip, array());

    // Make tasks be checked
    $ip_tasks[$task] = true;

    // Now we overwrite the array in the hashmap with our new tasks array
    $GLOBALS['cache']->put($ip, $ip_tasks);
}

function uncheck_task($ip, $task) {
    // global $cache;

    // Gets tasks array for $ip or defaults to empty array if none exists
    $ip_tasks = $GLOBALS['cache']->getOrDefault($ip, array());

    // Make tasks be unchecked
    $ip_tasks[$task] = false;

    // Now we overwrite the array in the hashmap with our new tasks array
    $GLOBALS['cache']->put($ip, $ip_tasks);
}

function clear_tasks($ip) {
    // global $cache;

    // Overwrite ip's tasks with an empty array
    $GLOBALS['cache']->put($ip, array());
}