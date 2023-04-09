<?php

// Here we define some GraphQL types

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$taskType = new ObjectType([
    'name' => 'Task',
    'fields' => [
        'task' => Type::nonNull(Type::string()),
        'checked' => Type::nonNull(Type::boolean())
    ]
]);

$tasksResponse = new ObjectType([
    'name' => 'TasksResponse',
    'fields' => [
        // 'data' => Type::nonNull(Type::listOf($taskType)),
        'data' => [
            'type' => Type::nonNull(Type::listOf($taskType))
        ]
    ]
]);

function getTaskObjectArray($ip) {
    $ip_tasks = get_tasks($ip);

    $tasks = array();


    // Convert task array to the Task object types
    foreach ($ip_tasks as $task => $checked) {
        array_push($tasks, [
            'task' => $task,
            'checked' => $checked
        ]);
    }

    return [
        'data' => $tasks
    ];
}

// Here we define our resolvers for our server's operations

// Our query operations
$queries = [
    'test' => [
        // 'type' => Type::nonNull(Type::listOf($taskType)),
        'type' => Type::nonNull($tasksResponse),
        'args' => [
            'ip' => Type::nonNull(Type::string()), // Not sure how to get IP from request in this library, so just make the IP aprt of the request
        ],
        'resolve' => function ($rootValue, array $args): array {
            $test = array();

            array_push($test, [
                'task' => 'Task 1',
                'checked' => true
            ]);
            array_push($test, [
                'task' => 'Task 2',
                'checked' => false
            ]);

            return [
                'data' => $test
            ];
        }
    ],

    'tasks' => [
        // 'type' => Type::nonNull(Type::listOf($taskType)),
        'type' => Type::nonNull($tasksResponse),
        'args' => [
            'ip' => Type::nonNull(Type::string()), // Not sure how to get IP from request in this library, so just make the IP aprt of the request
        ],
        'resolve' => function ($rootValue, array $args): array {
            return getTaskObjectArray($args['ip']);
        }
    ]
];

// Our mutation operations
$mutations = [

    'add_task' => [
        'type' => Type::nonNull($tasksResponse), // After each mutation, we always return the new state of the ip's tasks
        'args' => [
            'ip' => Type::nonNull(Type::string()),
            'task' => Type::nonNull(Type::string())
        ],
        'resolve' => function ($rootValue, array $args): array {
            // Add task
            add_task($args['ip'], $args['task']);
            
            // Return mutated array as tasks array
            return getTaskObjectArray($args['ip']);
        }
    ],

    'remove_task' => [
        'type' => Type::nonNull($tasksResponse),
        'args' => [
            'ip' => Type::nonNull(Type::string()),
            'task' => Type::nonNull(Type::string())
        ],
        'resolve' => function ($rootValue, array $args): array {
            // Remove task
            remove_task($args['ip'], $args['task']);
            
            return getTaskObjectArray($args['ip']);
        }
    ],

    'check_task' => [
        'type' => Type::nonNull($tasksResponse),
        'args' => [
            'ip' => Type::nonNull(Type::string()),
            'task' => Type::nonNull(Type::string())
        ],
        'resolve' => function ($rootValue, array $args): array {
            // Remove task
            check_task($args['ip'], $args['task']);
            
            return getTaskObjectArray($args['ip']);
        }
    ],

    'uncheck_task' => [
        'type' => Type::nonNull($tasksResponse),
        'args' => [
            'ip' => Type::nonNull(Type::string()),
            'task' => Type::nonNull(Type::string())
        ],
        'resolve' => function ($rootValue, array $args): array {
            // Remove task
            uncheck_task($args['ip'], $args['task']);
            
            return getTaskObjectArray($args['ip']);
        }
    ],

    'clear_task' => [
        'type' => Type::nonNull($tasksResponse),
        'args' => [
            'ip' => Type::nonNull(Type::string())
        ],
        'resolve' => function ($rootValue, array $args): array {
            // Remove task
            clear_task($args['ip']);
            
            return getTaskObjectArray($args['ip']);
        }
    ],
];