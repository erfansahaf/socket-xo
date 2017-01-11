## Project Info ##

Language: Javascript (with Node.js)

Libraries: Express, Socket.io, nedb, jQuery and others. (Listed in package.json file)

IDE: Jetbrains PHPStorm v10

Note: All server-side and client-side codes are written in WebSocket protocol. Game history will store in /databases/logs.db

Note 2: This game is just developed for training purposes so it doesn't have Game Room and it is not good for real and production environments. Also, only 2 players can play simultaneously.

## How to run ##

To run this project, you must have Node.js installed on your system. Then:

Clone the project and navigate to project directory using command line and run the following command to install dependencies:

> npm install

After installing dependencies, serve the project by using:

> node app.js

Afterward open your browser and go to http://localhost:3000 to see the game sheet.
To start the game, you should open another browser tab with the ssame (localhost:3000) url. When the 2 players get connected to the server successfully, the game will start.

## License ##

This project is under MIT License.