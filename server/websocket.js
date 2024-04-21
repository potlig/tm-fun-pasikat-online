// const WebSocket = require('ws');
// const http = require('http');
// const express = require('express');

// const app = express();
// const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);
//     // You can process the received message here and send a response.
//     ws.send(`You sent: ${message}`);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('WebSocket server is listening on http://localhost:3000');
// });

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});