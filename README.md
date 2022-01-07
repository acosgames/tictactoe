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


## About Client

Client is built using ReactJS.  It will run inside an iframe and communicate with the parent frame which is the simulator's client.  

All assets (images, svg, audio) should be packed into a single `client.bundle.js` file.

A browser-sync is included so that your changes are reflected immediately.

## About Server

Server code is built using NodeJS code and bundled into a single `server.bundle.js` file.

## About Simulator

Simulator runs a simple frontend that displays the your `client.bundle.js` inside an iframe.  

Simulator also runs a NodeJS express/socket.io server with a worker that uses vm2 to run your `server.bundle.js` code.

