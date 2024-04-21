import { useState } from "react";

function WebSocketConnect(){

	const ws = new WebSocket("ws://localhost:8080");

	
	ws.addEventListener("open", ()=>{
		console.log("connected");
		ws.send("Send Test");

	})


	ws.addEventListener("message", (data)=>{
		return data;
	})

}


export default WebSocketConnect;
