# Tic Tac Toe
Classic game of X and O on a 9 square grid



[<img width="100" src="https://user-images.githubusercontent.com/96845776/161881777-c6000699-a9b0-4f9d-9bde-7ab22d05196b.png" />](https://acos.games/g/tictactoe)

[Play Tic Tac Toe on ACOS](https://acos.games/g/tictactoe)

[ACOS Documentation](https://sdk.acos.games)

--- 

## Getting Started

Requires Node v16+

### Installation 
```bash
npm install
```

### Run Simulator, Client, and Server
```bash
npm start
```

### Playing the game

1. Tab will open automatically at [http://localhost:3200/](http://localhost:3200/)
2. Enter a username and click 'Join'
3. Click "Add Fake Player" 
4. Click "Reset game"
5. Click "Join" for players you want to play
6. Click "Start Game"

The game was designed to play in Scaled Resolution mode, 4:4 resolution, 1200 width.

## VSCode Debugging, add to launch.json
```json
{
    "command": "npm start",
    "name": "Launch Tic Tac Toe",
    "request": "launch",
    "type": "node-terminal"
},
```


## About Client

Client is built using ReactJS.  It will run inside an iframe and communicate with the parent frame which is the [Simulator's](https://github.com/acosgames/acosgames) client.  

All assets (images, svg, audio) should be packed into a single `client.bundle.js` file.

A browser-sync is included so that your changes are reflected immediately.

## About Server

Server code is built using NodeJS code and bundled into a single `server.bundle.js` file.

## About Simulator

[Simulator](https://github.com/acosgames/acosgames) runs a simple frontend that displays your `client.bundle.js` inside an iframe.  

[Simulator](https://github.com/acosgames/acosgames) also runs a NodeJS express/socket.io server with a worker that uses vm2 to run your `server.bundle.js` code.

