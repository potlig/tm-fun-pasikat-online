const { webSocketIP } = require("data/constants/constants");
import { SocketIO } from "data/constants/constants";
import React,{useEffect, useState} from "react";
// import { SocketIO } from "data/constants/constants";

const Timer=(props)=>{
	const {minutes, seconds} = props
	// console.log(props)
	
	// const [minutes, setMinutes]=useState(minutes);
	// const [seconds, setSeconds]=useState(seconds);

	// useEffect(()=>{
		// const ws = new WebSocket(webSocketIP)
		
		// SocketIO.on("time-left", (data=>{
		// 	setMinutes(data.timeRemaining.minutes)	
		// 	setSeconds(data.timeRemaining.seconds)	
		// }))
		// ws.addEventListener("open", ()=>{
		// 	ws.addEventListener("message", (data)=>{
		// 		const jsonData = JSON.parse(data.data)
		// 		if("timeRemaining" in jsonData){
		// 			setMinutes(jsonData.timeRemaining.minutes)	
		// 			setSeconds(jsonData.timeRemaining.seconds)	
		// 		}
		// 	})
		// })
	// },[])

	return(
		<div style={{marginLeft: "auto", marginRight: "auto", textAlign:"center"}}>
			<h4 style={{ background: "white", paddingLeft:"10px", paddingRight:"10px",  paddingTop:"5px", borderRadius: "5px"}}><i className="nc-icon nc-time-alarm text-primary"></i> {minutes}:{seconds}</h4>
		</div>
	
	)
}


export default Timer;