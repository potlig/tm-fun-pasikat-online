// const { webSocketIP } = require("data/constants/constants");
import React,{useEffect, useState} from "react";


const TimerDisplay=(props)=>{
	const {minutes, seconds} = props
	// const [minutes, setMinutes]=useState("");
	// const [seconds, setSeconds]=useState("");
	useEffect(()=>{
		// const ws = new WebSocket(webSocketIP)

		// ws.addEventListener("open", ()=>{
		// 	ws.addEventListener("message", (data)=>{
		// 		const jsonData = JSON.parse(data.data)
		// 		if("timeRemaining" in jsonData){
		// 			setMinutes(jsonData.timeRemaining.minutes)	
		// 			setSeconds(jsonData.timeRemaining.seconds)	
		// 		}
		// 	})
		// })
	},[])

	return(
		<div style={{marginLeft: "auto", marginRight: "auto", textAlign:"center"}}>
			<h4 style={{ background: "white", paddingLeft:"10px", paddingRight:"10px",  paddingTop:"10px", paddingBottom:"10px", borderRadius: "5px", fontSize: "60px", width:"250px"}}><i className="nc-icon nc-time-alarm text-primary"></i> {minutes}:{seconds}</h4>
		</div>
	
	)
}


export default TimerDisplay;