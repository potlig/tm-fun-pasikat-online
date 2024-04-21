import {io} from "socket.io-client"

export const mode = "cors";
export const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

export const ip = "localhost"

export const localIP = `http://${ip}:3001`;
export const webSocketIP = `ws://${ip}:8080`;

export const SocketIO = io('http://localhost:8080')

// status:
// 1. waiting - waiting for players to join
// 2. start - stop waiting and go to select categories
// 3. categories - selecting categories
// 4. play - start playing the game
// 5. end - the games end
export const statusList = { waiting:"waiting",start: "start", categories: "categories", readying: "readying", play: "play", end: "end", reset:"reset" }