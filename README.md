# PlanIT
PlanIt is a  group project management system designed to streamline collaboration and task tracking within teams and organizations.Users can create, manage, and collaborate on projects effortlessly.

## Prerequisites
Before running the project make sure you have installed [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/).

## Setup Instructions

1.Install Dependencies
   ```
   npm install
   ```
   
2.Include the port, google project credentials , secret and mongoDB credentials in a .env file.

3.Start the application
   ```
   npm start
   ```
  Alternatively you can also use nodemon for a better dev experience
    ```
    nodemon server.js
    ```
   
4.Access the application
   Open your web browser and go to http://localhost:{port}.

## Testing
You can use 
```
npm test
```
to execute the written test codes. New test code can be added to the test folder of the repository as well.



## Project Structure
The project structure is organized as follows:
- /routes: defines all the express routes
- /controllers: implement route handlers and business logic
- /models: define mongoDB models
- /middleware: all the middleware functions
- /config: configuration files
- /views: EJS files
