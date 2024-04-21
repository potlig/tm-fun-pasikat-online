import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {mode, headers, localIP } from "data/constants/constants"
import { CookiesProvider, useCookies } from "react-cookie";
// import WebSocketConnect from "WebSocket/WebSocket";
import  { Redirect } from 'react-router-dom'
import './Applogin.css';
import background from '../assets/img/red-bg.jpg'
import { useEffect } from "react";

function Login(){

	const [rememberMe, setRememberMe] = useState(false);
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const handleSetRememberMe = () => setRememberMe(!rememberMe);
	const [cookies, setCookie, removeCookie] = useCookies(["token", "username", "user_id", "roomName"]);

	const login = async () => {
		try {
		const body = { username: userName, password: password, rememberMe: rememberMe };
		await fetch(`${localIP}/login`, {
			method: "POST",
			mode: mode,
			headers: headers,
			body: JSON.stringify(body),
		})
			.then((response) => 
			response.json()
			)
			.then((data) => {
			console.log(data);
			console.log(data)
			setCookie("accessToken", data.accessToken);
			setCookie("username", data.username);
			setCookie("is_admin", data.is_admin);
			setCookie("refreshToken", data.refreshToken);
			setCookie("user_id", data.user_id);
			if (data.is_admin) {
				// alert("admin")
				window.location.href = "/admin/game";
			} else {
				// alert("not admin")
				// window.location.href = "/queue";
			}
			})
			.catch((error) => {
			console.error("There was a problem with the Fetch operation:", error);
			});
			
		// window.location.href = '/dashboard';
		} catch (error) {
		console.log(error);
		}
	};
	// const [cookies, setCookie] = useCookies(["player_id", "playerName"]);
	// let history = useHistory();
	// const [playerName, setPlayerName] = useState();
	
	// const [showError, setShowError] = useState(false);

	// console.log(cookies)
	// if(cookies && cookies !== {}){
	// 	const player_id = cookies.player_id;
	// 	if(player_id){
	// 		console.log(player_id)
	// 		fetch(`${localIP}/playerById/?player_id=${player_id}`)
	// 		.then(response => response.json())
	// 		.then(data => {
	// 			console.log(data)
	// 			if(data.length > 0){
	// 				if(data[0].player_id){
	// 				setCookie("player_id", data[0].player_id);
	// 				setCookie("playerName", data[0].name);
	// 				history.push('/player-area')		
	// 			}
	// 			}
					
	// 		})
	// 		.catch(error => {
	// 			console.error('There was a problem with the Fetch operation:', error);
	// 			alert(error)
	// 		})
	// 	}
		
	// 	// history.push('/player-area')
	// }
	// const onJoinClick= ()=>{
	// 	if(playerName){
	// 		// Proceed to waiting page

	// 		const method = "POST";
	// 		const body = {name: playerName, ready: false, finished: false};
	// 		const url = `${localIP}/players`;
	// 		console.log( JSON.stringify(body))
	// 		const response = fetch(url, {
	// 			method: method,
	// 			mode: mode,
	// 			headers: headers,
	// 			body: JSON.stringify(body)
	// 		}).then(response => response.json())
	// 		.then(data => {
	// 			setCookie("player_id", data[0].player_id);
	// 			setCookie("playerName", data[0].name);
	// 			history.push('/player-area')			
	// 		})
	// 		.catch(error => {
	// 			console.error('There was a problem with the Fetch operation:', error);
	// 			alert(error)
	// 		})
	// 	}
	// 	else{
	// 		setShowError(true);
	// 	}
	// }
	// const playerNameChange=(event)=>{
	// 	setPlayerName(event.target.value)
	// }
	return(
		<Container style={{backgroundImage: `url(${background})`}}>
			<div style={{
				position: 'absolute', left: '50%', top: '50%', 
				transform: 'translate(-50%, -50%)'}}
				>

				<Row className="justify-content-md-center justify-content-sm-center ">
					<img style={{ height: "auto", width: "60%", marginLeft: "auto",  marginRight: "auto", }} src={require("assets/img/Tittle-and-Logo.png")} alt="..." />
				 
   
				</Row>
				 
				<Row style={{marginTop: "3rem"}} className="justify-content-md-center">
					<input style={{width: "100%"}} placeholder="Username" 
					 value={userName} onChange={(event)=>{setUserName(event.target.value)}}
					 type="text" className="form-control"/>
				</Row>
				<Row style={{marginTop: "3rem"}} className="justify-content-md-center">
					<input style={{width: "100%"}} placeholder="Password" 
					 value={password} onChange={(event)=>{setPassword(event.target.value)}}
					 type="password" className="form-control"/>
				</Row>

				<Row style={{marginTop: "1.5rem"}} className="justify-content-md-center">
					<Button style={{width: "100%"}} variant="primary" 
					 onClick={login} 
					>
					Join Game
					</Button>
				</Row>
				{/* {
					showError ? <Row className="justify-content-md-center">
						<h4 style={{color: "red"}}>Please Enter name!</h4>
					</Row> : null
				} */}
			</div>
		</Container>

	
	)
}

export default Login;