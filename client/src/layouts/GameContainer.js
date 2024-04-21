import CategorySelect from "components/CategorySelect";
import Readying from "components/Readying";
import GameRoom from "components/GameRoom";
import QRCode from "components/QRCode";
import { localIP } from "data/constants/constants";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { statusList } from "data/constants/constants";
import ServerReadying from "components/ServerReadying";
import { mode } from "data/constants/constants";
import { headers } from "data/constants/constants";
import GameRoomDisplay from "components/GameRoomDisplay";
import { webSocketIP } from "data/constants/constants";
import Scores from "components/Scores";
import Timer from "components/Timer";
import './Applogin.css';
import background from '../assets/img/blue-bg.jpg'
import TimerDisplay from "components/TimerDisplay";
import ScoresServer from "components/ScoresServer";
import { SocketIO } from "data/constants/constants";
import { useCookies } from "react-cookie";

function GameContainerLayout(){
	const [players, setPlayers] = useState()
	const [start, setStart] = useState(false);
	const [minutes, setMinutes] = useState();
	const [seconds, setSeconds] = useState();
	const [status, setStatus]= useState();
	const [palyersReady, setPlayersReady]=useState();
	const [category, setCategory] = useState();
	const [categorySelected, setCategorySelected] = useState();
	const [questionSelected, setQuestionSelected] = useState();
	const [refetchData, setRefetchData]=useState()
	const [cookies, setCookies, removeCookie] = useCookies(["player_id", "username", "roomName"]);
	let ws;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const roomName = urlParams.get('roomName')
	
	useEffect(()=>{
		const data = {roomName: roomName, playerName: "qrcode"}
		console.log("join")
		console.log(data)
		SocketIO.emit('join-room', data)


	},[])
	useEffect(()=>{
		// function updateStatus(){
		// 	console.log("update status")
		// 	getStatus()
		// }
		SocketIO.on("update-status", (data)=>{
			getStatus()
		})
		SocketIO.on("player-joined", (data)=>{
			console.log(data)
			setRefetchData(data)
			getStatus()
		})
		SocketIO.on("time-left", (data)=>{
			console.log(data)
			const jsonData = JSON.parse(data)
			// console.log(jsonData)
			// setTimeStarted(jsonData.timeStarted)
			setMinutes(jsonData.timeRemaining.minutes)
			setSeconds(jsonData.timeRemaining.seconds)
		})
		SocketIO.on("reset-game", ()=>{				
			getStatus()
		})
	},[])

	useEffect(()=>{

		if(roomName === undefined){
			fetch(`${localIP}/roomByUserId?user_id=${cookies.user_id}`)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if(data.length>0){
					
					getPlayers()
				}
			})
		}

		if(roomName !== undefined){
			getPlayers()
	
		}
	},[refetchData])



	const getStatus=()=>{
		// if(roomName !== undefined){
		fetch(`${localIP}/getRoom?roomName=${roomName}`)
		.then(response => response.json())
		.then(data => {
			console.log(data[0].status)
			setStatus(data[0].status)
			if(data[0].status==="play"){
				
				fetch(`${localIP}/category-selected-full`)
					.then(response => response.json())
					.then(data => {
						setCategorySelected(data)
						console.log(data)
					})
				fetch(`${localIP}/question-selected-full`)
				.then(response => response.json())
				.then(data => {
					setQuestionSelected(data)
					console.log(data)
				})
			}
		})
		// }

	}
	const getPlayers=()=>{
		if(roomName !== undefined){
		fetch(`${localIP}/playersByRoom?roomName=${roomName}`)
		.then(response => response.json())
		.then(data => {
			console.log("getPlayers: "+data)
			setPlayers(data)
		})
		}
	}
	// useEffect(()=>{
	// 	ws = new WebSocket(webSocketIP)
	// 	ws.reconnectInterval = 3000
	// 		ws.addEventListener("open", ()=>{
				
	// 		ws.send("newUser");

	// 		ws.addEventListener("message", (data)=>{
	// 			console.log(data.data)
	// 			const jsonData = JSON.parse(data.data)
	// 			console.log("afterjsonData")
	// 			if("message" in jsonData){

	// 				if(jsonData.message==="userConnected" || jsonData.message==="reset" ){
	// 					fetch(`${localIP}/players`)
	// 					.then(response => response.json())
	// 					.then(data => setPlayers(data))
	// 				}
					
				
	// 			}
	// 			if("currentStatus" in jsonData){

	// 				if(jsonData.currentStatus === "waiting"){
	// 					setStatus(statusList.waiting)
				
						
	// 				}
	// 				if(jsonData.currentStatus === "start"){
	// 					setStatus(statusList.start)
	// 				}
	// 				if(jsonData.currentStatus === "readying"){
	// 					setStatus(statusList.readying)


	// 				}
	// 				if(jsonData.currentStatus === "play"){
	// 					setStatus(statusList.play)
	// 					fetch(`${localIP}/category-selected-full`)
	// 						.then(response => response.json())
	// 						.then(data => {
	// 							setCategorySelected(data)
	// 							console.log(data)
	// 						})
	// 					fetch(`${localIP}/question-selected-full`)
	// 					.then(response => response.json())
	// 					.then(data => {
	// 						setQuestionSelected(data)
	// 						console.log(data)
	// 					})
	// 				}
	// 				if(jsonData.currentStatus === "end"){
	// 					setStatus(statusList.end)
	// 				}
					
	// 			}
	// 			if("timeRemaining" in jsonData){
	// 				setMinutes(jsonData.timeRemaining.minutes)	
	// 				setSeconds(jsonData.timeRemaining.seconds)	
	// 				console.log(jsonData.timeRemaining.seconds)
	// 			}
	// 		})

	// 		})
	// 		return () => {
	// 		// cancel the subscription
	// 		ws.current.disconnect();
	// 		};
	// },[])

	// useEffect(()=>{
	// 	fetch(`${localIP}/category-selected-full`)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setCategorySelected(data)
	// 		console.log(data)
	// 	})
	// 	fetch(`${localIP}/question-selected-full`)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setQuestionSelected(data)
	// 		console.log(data)
	// 	})
	// }, [])



		const display=(status)=>{
		console.log(status)
		switch(status){
			
			case "waiting":
				return  <QRCode players={players}/>
			case "reset":
				return  <QRCode players={players}/>
			// case "start":
			// 	return  <CategorySelect isPlayer={false}  minutes={minutes} seconds={seconds}/>
			case "readying":
				return <ServerReadying/>
			case "play":
				return (
					<div style={{marginLeft: "auto", marginRight:"auto", fontSize: "40px" }}>
					{status === "play"? <TimerDisplay  minutes={minutes} seconds={seconds} /> : null}
						<GameRoomDisplay  questionSelected={questionSelected}  categorySelected={categorySelected}  minutes={minutes} seconds={seconds} isPlayer={false}/>
					</div>
				)
			case "end":
				return <ScoresServer roomName={roomName} questionSelected={questionSelected}/>
			  default:
      			return <QRCode players={players}/>
		}
	}
	return(
		<Container style={{backgroundImage: `url(${background})`, marginLeft: "auto", marginRight:"auto", overflow: "hidden" }} fluid >
			<Row>
					{display(status)}
			</Row>
    	</Container>
	)		
}

export default GameContainerLayout;