import QRCode from "components/QRCode";
import Waiting from "components/Waiting";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
// import WebSocketConnect from "WebSocket/WebSocket";
import {mode, headers, localIP,statusList } from "data/constants/constants";
import CategorySelect from "components/CategorySelect";
import { useCookies } from "react-cookie";
import WaitForGameToFinish from "components/WaitForGameToFinish";
import Readying from "components/Readying";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import GameRoom from "components/GameRoom";
// import { webSocketIP } from "data/constants/constants";
import Timer from "components/Timer";
import Scores from "components/Scores";
import './Applogin.css';
import background from '../assets/img/red-bg.jpg'
import background2 from '../assets/img/blue-bg.jpg'
import { SocketIO } from "data/constants/constants";


function PlayerArea(){
	const [cookies, setCookie, removeCookie] = useCookies(["player_id", "playerName", "roomName"]);
	const [isWaiting, setIsWaiting] = useState(true);
	const [wsMessage, setWSMessage] = useState();
	const [players, setPlayers] = useState();
	const [categoryTime, setCategoryTime] = useState()
	const [status, setStatus]= useState();
	const [categorySelected, setCategorySelected] = useState();
	const [questionSelected, setQuestionSelected] = useState();
	const [player_id, setPlayer_id] = useState();
	const [timeStarted, setTimeStarted] =useState();
	const [refreshData, setRefreshData] = useState();
	let ws;
	let history = useHistory();
	const roomName = cookies.roomName;
	const playerName = cookies.playerName

	
	useEffect(()=>{
		if(cookies.roomName !== undefined){
			
			const data = {roomName: cookies.roomName, playerName: cookies.playerName}
			SocketIO.emit('join-room', data)
			if(cookies.roomName !== undefined){
				console.log("init")
				getStatus()
				playerCheck()
			}
		}

	},[])

	const joinRoom = ()=>{
		const data = {roomName: cookies.roomName, playerName: cookies.playerName}
		console.log("joinRoom"+ cookies.roomName)
		SocketIO.emit('join-room', data)
		if(cookies.roomName !== undefined){
			console.log("init")
			getStatus()
			playerCheck()
		}
	}




	const getStatus=()=>{
		if(cookies.roomName !== undefined){
			fetch(`${localIP}/getRoom?roomName=${cookies.roomName}`)
			.then(response => response.json())
			.then(data => {
				console.log("getStatus")
				console.log("getStatus", data)
				
				if(data[0].status ==="play"){
					// fetch(`${localIP}/category-selected-full`)
					// .then(response => response.json())
					// .then(data => {
					// 	setCategorySelected(data)
					// 	console.log(data)
					// })
					// fetch(`${localIP}/question-selected-full`)
					// .then(response => response.json())
					// .then(data => {
					// 	setQuestionSelected(data)
					// 	console.log("question selected")
					// })
					window.location.href = "/game";

				}
				else{
					setStatus(data[0].status)
				}
			})
		}
	}

	// })
	const playerCheck=()=>{
		console.log("player check")
		if(cookies){
			const player_id = cookies.player_id;
			const roomName = cookies;
			console.log(player_id)
			// const data = {roomName: roomName, playerName: "admin"}
			// SocketIO.emit('join-room', roomName)
			console.log(player_id)
			fetch(`${localIP}/playerById/?player_id=${player_id}`)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if(data.length > 0){
					if(data[0].player_id){
					setCookie("player_id", data[0].player_id);
					setCookie("playerName", data[0].name);
					setPlayer_id(data[0].player_id)
					// history.push('/player-area')		
					}
				}
				else {
					history.push('/player-login')	
				
				}
					
			})
			.catch(error => {
				console.error('There was a problem with the Fetch operation:', error);
				alert(error)
			})
		history.push('/player-area')
	}
	}
	// useEffect(()=>{

		// ws = new WebSocket(webSocketIP)
		// ws.reconnectInterval = 1000
		// ws.addEventListener("open", ()=>{
		//	playerCheck();
		// 	ws.send("newUser");

		// 	ws.addEventListener("message", (data)=>{
		// 		// console.log(data.data)
		// 		const jsonData = JSON.parse(data.data)
		// 		// console.log("afterjsonData")
		// 		if("message" in jsonData){

		// 			if(jsonData.message==="userConnected"){
		// 				fetch(`${localIP}/players`)
		// 				.then(response => response.json())
		// 				.then(data => setPlayers(data))
		// 			}
		// 			if(jsonData.message==="reset"){
						
		// 				history.push('/player-login')
		// 			}
		// 		}
				
		// 		if("currentStatus" in jsonData){
		// 			if(jsonData.currentStatus === "waiting"){
		// 				setStatus(statusList.waiting)
		// 			}
		// 			if(jsonData.currentStatus === "start"){
		// 				setStatus(statusList.start)
		// 			}
		// 			if(jsonData.currentStatus === "readying"){
		// 				setStatus(statusList.readying)
						

						

		// 			}
		// 			if(jsonData.currentStatus === "play"){
		// 				setStatus(statusList.play)
		// 				fetch(`${localIP}/category-selected-full`)
		// 					.then(response => response.json())
		// 					.then(data => {
		// 						setCategorySelected(data)
		// 						console.log(data)
		// 					})
		// 				fetch(`${localIP}/question-selected-full`)
		// 				.then(response => response.json())
		// 				.then(data => {
		// 					setQuestionSelected(data)
		// 					console.log("question selected")
		// 				})

		// 			}
		// 			if(jsonData.currentStatus === "end"){
		// 				setStatus(statusList.end)
		// 			}
					
		// 		}
		// 		if("timeStarted" in jsonData){			
		// 			setTimeStarted(jsonData.timeStarted)
		// 			console.log(jsonData.timeStarted)
		// 		}
		// 	})

		// 	})


	// },[])

    const wrapperSendReady = useCallback(val => {
        // ws.send("readyUp")
		if(roomName!== undefined){
			console.log("callback"+roomName)
			console.log("playerName"+playerName)
			const data = {roomName: roomName, playerName: playerName}
			console.log("wrapper"+data)
			SocketIO.emit('ready', data)
			window.location.href = "/game";
			// console.log("rejoin room")
			// joinRoom();
			// setRefreshData(data)
		}
		
		
    }, []);

	
	// useEffect(async()=>{
	// 	await fetch(`${localIP}/players`)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setPlayers(data)
	// 	})
	// 	await fetch(`${localIP}/category-selected-full`)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setCategorySelected(data)
	// 		console.log(data)
	// 	})
	// 	await fetch(`${localIP}/question-selected-full`)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setQuestionSelected(data)
	// 		console.log(data)
	// 	})
	// }, [])
	const done = ()=>{
		console.log("done")
		removeCookie('player_id');
		history.push(`/player-login?roomName=${cookies.roomName}`)
	}

	useEffect(()=>{
		function updateStatus(){
			console.log("player Area useEff update status")
			getStatus()
		}


		SocketIO.on("time-left", ()=>{
			console.log("timeleft")
		})
		SocketIO.on("update-status", updateStatus)
		SocketIO.on("game-start", updateStatus)
		SocketIO.on("reset-game", ()=>{				
			console.log("reset")
			// history.push('/player-login')
		})
	},[])
	

	const Display=()=>{
		switch(status){
		case "waiting":
			return  <Waiting players={players} isPlayer={true}/>
		case "readying":
			return  <Readying player_id ={player_id} categorySelected={categorySelected} wrapperSendReady={wrapperSendReady} isPlayer={true}/>
		case "play":
			return (
				<GameRoom timeStarted={timeStarted} questionSelected={questionSelected} player_id ={player_id} categorySelected={categorySelected} wrapperSendReady={wrapperSendReady} isDone={false} isPlayer={true}/>
			)
		case "end":
			return <Scores/>
		default:
			return <Container style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}}>
						{/* <Row className="justify-content-md-center"> */}
						<div>
							<h1 style={{textAlign:"center", color:"yellow", fontSize: "40px"}}>Loading...</h1>
						</div>
							
						{/* </Row> */}

					</Container>
		}
	}

	return(
  
		<Container fluid style={{backgroundImage: status==="play" ?  `url(${background2}`:`url(${background}`, marginLeft: "auto", marginRight:"auto"}}>
			{/* <Row>
				{status === "play"? <Timer/> : null}
			</Row> */}
			<Row >
					{Display(status)}
			</Row>
			<Row>
				{status === "end" ? <Button style={{width: "20%", height: "6%", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}} 
					onClick={()=>done()}>Done</Button>: null}
			</Row> 
    	</Container>
 
	)		
}

export default PlayerArea;