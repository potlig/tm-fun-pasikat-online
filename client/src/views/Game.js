import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import { mode } from "data/constants/constants";
import { headers } from "data/constants/constants";
import { localIP } from "data/constants/constants";
import { webSocketIP } from "data/constants/constants";

import ShortUniqueId from 'short-unique-id';
import { SocketIO } from "data/constants/constants";
import { useCookies } from "react-cookie";
import { Socket } from "socket.io-client";

function Game() {
	const [cookies, setCookies, removeCookie] = useCookies(["player_id", "username", "roomName"]);
	const [categorySelected, setCategorySelected] = useState()
	const [players, setPlayers] = useState()
	const [wsState, setWSState] = useState();
	const [hideStartButton, setHideStartButton]=useState(false);
  	const [show, setShow] = useState(false);
	// const [room, setRoom] = useState();
	const [playerLink, setPlayerLink] = useState();
	const [status, setStatus] = useState();
	const [refetchData, setRefetchData]=useState()
	let ws;
	const openGameDisplay=()=>{
		const url="http://localhost:3000/game-display";
		window.open(url, "TM Game", "height=800,width=800");
	}

	useEffect(()=>{

		
		if(!cookies.user_id){
			window.location.href = "http://localhost:3000";
		}
		fetch(`${localIP}/roomByUserId?user_id=${cookies.user_id}`)
		.then(response => response.json())
		.then(data => {

			console.log(data)
			if(data.length>0){
				console.log("has room")
				const joinData = {roomName: cookies.roomName, playerName: cookies.username}
				SocketIO.emit('create-room', joinData)

				getPlayers()
				const url=`http://localhost:3000/game-display?roomName=${cookies.roomName}`;
				const playerLogin = `http://localhost:3000/player-login?roomName=${cookies.roomName}&room_id=${cookies.roomID}`;
				setCookies("roomName", cookies.roomName ,  400, '/')
				setCookies("roomID", data[0].room_id,   400, '/')
				setPlayerLink(playerLogin);
			}
			else{
				console.log("no rooms")
			}
		})
	},[refetchData])



	const getStatus=()=>{
		if(cookies.user_id !== undefined){
		const response = fetch(`${localIP}/roomByUserId?user_id=${cookies.user_id}`)
		.then(response => response.json())
		.then(data => {
			console.log("getStatus")
			console.log("cookies user_id: "+ cookies.user_id)
			console.log("data: "+ data)
			setStatus(data[0].status)
			setRefetchData(data[0].status)
		})
		}

	}


	const getPlayers=()=>{
		console.log(cookies.roomName)
		if(cookies.roomName !== undefined){

		const url = `${localIP}/playersByRoom?roomName=${cookies.roomName}`
		console.log(url)
		fetch(`${localIP}/playersByRoom?roomName=${cookies.roomName}`)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			// const jsonData = JSON.parse(data)
			setPlayers(data)
		})
		}
	}

	const reset=  ()=>{
		
		const method = "POST";
		const url = `${localIP}/reset`;
		const body = {roomID: cookies.roomID, roomName: cookies.roomName}
		fetch(url, {
			method: method,
			mode: mode,
			headers: headers,
			body: JSON.stringify(body)
		}).then(response => response.json())
		.then(data => {
			
	
		})
		.catch(error => {
		console.error('There was a problem with the Fetch operation:', error);
		})

		console.log("finished reset")
		const socketData = {roomName: body.roomName, playerName: cookies.username}
		console.log("emitReset", socketData)
		SocketIO.emit('reset', socketData)
		getPlayers()
		getStatus()
	

		setHideStartButton(false)
		setShow(false)
		const gameContainerUrl=`http://localhost:3000/game-display?roomName=${cookies.roomName}&user_id=${cookies.user_id}`;
		window.open(gameContainerUrl, "TM Game", "height=800,width=800");
	}
	const handleClose = () => {
		setShow(false)
	};
	const handleShow = () => {
		setShow(true);
	}
	const convertTime =(seconds)=>{
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds% 60;
		return `${minutes} minutes ${remainingSeconds.toFixed()} second(s)`;

		return finalTime
	}

	const generateLinks = ()=>{
		playerLoginLink
	}

	const start =async (roomID)=>{
		
		console.log("start")
		let retrieveCtegory;
		setHideStartButton(true)
		
		const method = "POST";
		const url = `${localIP}/category-selected`;
		const body = {roomID: cookies.roomID}
		console.log("start cookies roomID")
		console.log(cookies.roomID)
		const categorySelectedResponse = await fetch(url, {
		method: method,
		mode: mode,
		headers: headers,
		body: JSON.stringify(body)
		})

		const getCategorySelected = await categorySelectedResponse.json();
		console.log("questionBody")
		console.log(getCategorySelected)
		setCategorySelected(getCategorySelected);
		retrieveCtegory=getCategorySelected;

		const questionBody = {category_id: retrieveCtegory[0].category_id, roomID: cookies.roomID};
		console.log(questionBody)
		const questionSelectedResponse = await fetch(`${localIP}/question-selected`, {
			method: "POST",
			mode: mode,
			headers: headers,
			body: JSON.stringify(questionBody)
		})
		const getQuestionSelected = await questionSelectedResponse.json();
		console.log(getQuestionSelected)
		console.log("send start signal")
		const socketDataQuestion = {roomName: cookies.roomName, playerName: cookies.username}
		console.log("send start signal2")
		SocketIO.emit("start-game", socketDataQuestion);

		

		const readyingBody = { roomID: cookies.roomID, status: "readying"};
		const updateRoomStatusResponse = await fetch(`${localIP}/update-room-status`, {
			method: "POST",
			mode: mode,
			headers: headers,
			body: JSON.stringify(readyingBody)
		})

		const getUpdateRoomStatus = await updateRoomStatusResponse.json();
		console.log("send start signal")
		const socketData = {roomName: cookies.roomName, playerName: cookies.username}
		console.log("send start signal2")
		SocketIO.emit("start-game", socketData);
	}	

	const createRoom =async () =>{
		// socket.on("connect", ()=>{
		// 	console.log(`You Connected with id: ${socket.id}`)
		// })
// 	console.log(questionBody)
		removeCookie('roomName');
		const uid = new ShortUniqueId ({length: 10 });
		const roomName = uid.rnd();
		const body = {roomName: roomName, createdBy: cookies.user_id };
		await fetch(`${localIP}/create-room`, {
			method: "POST",
			mode: mode,
			headers: headers,
			body: JSON.stringify(body)
			}).then(response => response.json())
			.then(res => {
				// setRoom(roomName)
				setCookies("roomName", roomName,  400, '/')
				setCookies("roomID", res[0].room_id,  400, '/')
				console.log("res")
				console.log(res)


				const url=`http://localhost:3000/game-display?roomName=${roomName}&user_id=${cookies.user_id}`;
				const playerLogin = `http://localhost:3000/player-login?roomName=${roomName}&room_id=${res[0].room_id}`;
			
				console.log(roomName+' '+cookies.roomName)
				// setRoom(roomName)
				setPlayerLink(playerLogin);
				window.open(url, "TM Game", "height=800,width=800");
				const data = {roomName: roomName, playerName: cookies.username}
				SocketIO.emit('create-room', data)
			})
			.catch(error => {
			console.error('There was a problem with the Fetch operation:', error);
		})



		
	}


	useEffect(()=>{
		function updateStatus(){
			getStatus()
			getPlayers()
		}
		SocketIO.on("player-joined", (data)=>{
			console.log(data)
			console.log("player-joined")
			setRefetchData(data)
		})



		SocketIO.on("update-status",updateStatus)
	},[])


	return (
		<>
			<Container  style={{     minHeight: "0px" }}>
				<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Warning!</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{fontFamily: "Roboto,Helvetica Neue,Arial,sans-serif"}}>Are you sure you want to reset the game?</Modal.Body>
				<Modal.Footer>
					{/* <Button variant="secondary" onClick={handleClose}>
					Cancel
					</Button> */}
					<Button variant="danger" onClick={()=>reset()}>
					Reset
					</Button>
				</Modal.Footer>
				</Modal>
				<Row>
					<Col lg="6" sm="6">
						<Card className="card-stats">
							<Card.Body>
								<Row>
								<Col xs="5">
									<div className="icon-big text-center icon-warning">
									<i className="nc-icon nc-controller-modern text-warning"></i>
									</div>
								</Col>
								<Col xs="7">
									<div className="numbers">
									<p style={{fontSize: "30px"}} >Players waiting</p>
									<Card.Title as="h4">{players? players.length : 0 }</Card.Title>
									</div>
								</Col>
								</Row>
							</Card.Body>
							<Card.Footer>
								<hr></hr>
								<div className="stats"/>
								{hideStartButton || players?.length ===0 ? null : <Button  variant="danger"  onClick={()=>start()}>
									 Start
								</Button>
								}
								<Button variant="danger" onClick={()=>handleShow()}>
									Reset
								</Button>
							</Card.Footer>
						</Card>
					</Col>
					
					
					<Col lg="6" sm="6">
						<Card className="card-stats">
							<Card.Body>
								<Row>
								<Col xs="5">
									<div className="icon-big text-center icon-warning">
									<i className="nc-icon nc-tv-2 text-success"></i>
									</div>
								</Col>
								<Col xs="7">
									<div className="numbers">
									<p style={{fontSize: "30px"}} >Game Display </p>
									<p style={{fontSize: "30px"}} >{status? `Status: ${status}`:""} </p>
									</div>
								</Col>
								<Col xs="7"><a style={{fontSize: "10px"}} >{playerLink}</a></Col>
								</Row>
							</Card.Body>
							<Card.Footer>
								<hr></hr>
								<div className="stats"/>
								<Button variant="danger" onClick={()=>createRoom()}>
									Open Game Display
								</Button>
							</Card.Footer>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col>
						<Card className="card-stats">
							<Card.Header>
								<Card.Title as="h4">Players currently playing</Card.Title>
							</Card.Header>
							<Card.Body>
								<Table className="table-hover table-striped">
									<thead>
									<tr>
										<th style={{fontSize: "30px"}}  className="border-0"><i className="nc-icon nc-single-02 text-primary"></i> Player Name</th>
										<th style={{fontSize: "30px"}}  className="border-0"><i className="nc-icon nc-single-02 text-primary"></i> Ready</th>
										<th style={{fontSize: "30px"}}  className="border-0"><i className="nc-icon nc-watch-time text-primary"></i> Time</th>
									</tr>
									</thead>
									<tbody>

										{players?.map(item=>{
											return (
											<tr>
												<td>{item.name}</td>
												<td>{item.ready ? "Ready" : "Not Ready"}</td>
												<td>{item.finished ? convertTime(item.time) : "No Answer"}</td>
											</tr>
											)
										})}
									</tbody>
								</Table>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default Game;