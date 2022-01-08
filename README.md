# tictactoe
Classic game of X and O on a 9 square grid

## Getting Started

### Installation 
```bash
npm install
```

### Run Simulator, Client, and Server
```bash
npm start
```

### Playing the game

1. Open 2 tabs at [http://localhost:3200/](http://localhost:3200/)
2. Enter a username on each tab and click 'Join'
3. When ready, press "Start Game"

The game was designed to play in Scaled Viewport mode, 4:4 resolution, 1200 width.


## About Client

Client is built using ReactJS.  It will run inside an iframe and communicate with the parent frame which is the [Simulator's](https://github.com/acosgames/acosgames) client.  

All assets (images, svg, audio) should be packed into a single `client.bundle.js` file.

A browser-sync is included so that your changes are reflected immediately.

## About Server

Server code is built using NodeJS code and bundled into a single `server.bundle.js` file.

## About Simulator

[Simulator](https://github.com/acosgames/acosgames) runs a simple frontend that displays your `client.bundle.js` inside an iframe.  

[Simulator](https://github.com/acosgames/acosgames) also runs a NodeJS express/socket.io server with a worker that uses vm2 to run your `server.bundle.js` code.

