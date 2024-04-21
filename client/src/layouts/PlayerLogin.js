import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {mode, headers, localIP } from "data/constants/constants"
import { CookiesProvider, useCookies } from "react-cookie";
import WebSocketConnect from "WebSocket/WebSocket";
import  { Redirect } from 'react-router-dom'
import './Applogin.css';
import background from '../assets/img/red-bg.jpg'
import { SocketIO } from "data/constants/constants";

function PlayerLogin(){
	const [cookies, setCookie, removeCookie] = useCookies(["player_id", "playerName", "roomName"]);
	let history = useHistory();
	const [playerName, setPlayerName] = useState();
	
	const [showError, setShowError] = useState(false);

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const roomName = urlParams.get('roomName')
	const roomID = urlParams.get('room_id')

	if(cookies && cookies !== {}){
		const player_id = cookies.player_id;
		if(player_id){
			console.log(player_id)
			fetch(`${localIP}/playerById/?player_id=${player_id}`)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if(data.length > 0){
					if(data[0].player_id){
					setCookie("player_id", data[0].player_id);
					setCookie("playerName", data[0].name);
					history.push('/player-area')		
				}
				}
					
			})
			.catch(error => {
				console.error('There was a problem with the Fetch operation:', error);
				alert(error)
			})
		}
		
		// history.push('/player-area')
	}
	const onJoinClick= async ()=>{
		if(playerName){
			// Proceed to waiting page
			removeCookie('roomName');
			const method = "POST";
			const body = {name: playerName, ready: false, finished: false, roomName: roomName};
			const url = `${localIP}/players`;
			console.log( JSON.stringify(body))
			const response = await fetch(url, {
				method: method,
				mode: mode,
				headers: headers,
				body: JSON.stringify(body)
			})
			// .then(response => response.json())
			// .then(data => {
		
			// })
			// .catch(error => {
			// 	console.error('There was a problem with the Fetch operation:', error);
			// 	alert(error)
			// })
			const data = await response.json()
			setCookie("player_id", data[0].player_id);
			setCookie("playerName", data[0].name);
			setCookie("roomID", roomID)
			setCookie("roomName", roomName)

			history.push(`/player-area`)	
		}
		else{
			setShowError(true);
		}
	}
	const playerNameChange=(event)=>{
		setPlayerName(event.target.value)
	}
	return(
		<Container style={{backgroundImage: `url(${background})`}}>
			<div style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}}>

				<Row className="justify-content-md-center justify-content-sm-center ">
					<img style={{ height: "auto", width: "100%", marginLeft: "auto",  marginRight: "auto", }} src={require("assets/img/Tittle-and-Logo.png")} alt="..." />
				 
   
				</Row>
				 
				<Row style={{marginTop: "3rem"}} className="justify-content-md-center">
					<input style={{width: "90%"}} placeholder="Enter Name" value={playerName} onChange={(event)=>{playerNameChange(event)}} type="text" className="form-control"/>
				</Row>

				<Row style={{marginTop: "1.5rem"}} className="justify-content-md-center">
					<Button style={{width: "90%"}} variant="primary" 
					onClick={onJoinClick} 
					>
					Join Game
					</Button>
				</Row>
				{
					showError ? <Row className="justify-content-md-center">
						<h4 style={{color: "red"}}>Please Enter name!</h4>
					</Row> : null
				}
			</div>
		</Container>

	
	)
}

export default PlayerLogin;