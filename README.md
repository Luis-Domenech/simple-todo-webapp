# ToDo App

Just a simple todo webapp for the purpose of showing how I use ReactJS and PHP.

## Frontend

A ReactJS frontend was setup using NextJS as a framework. Zustand was sued for state management and Formik and Zod for form management. GraphQL server querying is done using my [lfd-graphql-client](https://github.com/Luis-Domenech/lfd-graphql-client) package instead of something like Apollo or urql.

### To Run
1. Install NodeJS and Yarn
2. Go to client folder in the terminal and run `yarn`
3. Afterwards, run `yarn dev`


## Backend

Composer was used to setup the PHP server and its dependencies. The [graphql-php](https://github.com/webonyx/graphql-php/) package was used to setup the server as a graphql server.

### To Run
1. Install php
2. Go to the server folder and run the `setup-composer.sh` file
3. Run composer with the composer.lock file which will install the dependencies
4. Run the `run-server.sh` file

