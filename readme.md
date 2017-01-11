## Project Info ##

Language: Javascript (with Node.js)

Libraries: Express, Socket.io, nedb, jQuery and others. (Listed in package.json file)

IDE: Jetbrains PHPStorm v10

Note: All server-side and client-side codes, written in WebSocket protocol. Game history will store in /databases/logs.db

Note 2: This game just developed for training purposes so it hasn't Game Room and it isn't good for real and production environments. Also, only 2 online players supported at the same time.

## How to run ##

For run this project, Node.js must be installed on the system and then:

Clone the project and navigate to project directory using command line and run the following command for install dependencies:

> npm install

After installing dependencies, serve the project by using:

> node app.js

Then open your browser and go to http://localhost:3000 for see the game sheet.
For starting the game, you should open another browser tab with same (localhost:3000) url. Whenever 2 players connect to the server successfully, the game will start automatically.

## License ##

This project is under MIT License.