import { mode } from "data/constants/constants";
import { headers } from "data/constants/constants";
import { localIP } from "data/constants/constants";
import { ready } from "jquery";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Fade from 'react-bootstrap/Fade';
import reactRouter from "react-router";


const Readying=(props)=>{
	const {player_id, isPlayer, wrapperSendReady} = props;
	const [categorySelected, setCategorySelected] = useState([{}])
	const [isReady, setIsReady] = useState(false)

	useEffect( ()=>{
		fetch(`${localIP}/category-selected-full`)
		.then(response => response.json())
		.then(data =>{ setCategorySelected(data)
			console.log("data: "+ data)
		}).catch(error => console.log(eror))
	},[])


	console.log(categorySelected)

	const readyUp= ()=>{
		const method = "PUT";
		const body = {time: null, ready: true, player_id: player_id, finished: false};
		const url = `${localIP}/playerTime`;
		console.log(player_id)
		const response =  fetch(url, {
			method: method,
			mode: mode,
			headers: headers,
			body: JSON.stringify(body)
			}).then(response => response.json())
			.then(data => {
				console.log("readying")
				wrapperSendReady();
				setIsReady(true)
			})
			.catch(error => {
				console.error('There was a problem with the Fetch operation:', error);
			})

	
	}
	const random = (min, max)=>{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	return(
		<Container fluid style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}}>
			<div>
				<h1 className="ready" style={{textAlign: "center"}}>Category</h1>
				<h2 className="catval" style={{textAlign: "center"}}> {!!categorySelected[0]?.category ?categorySelected[0]?.category : null }</h2>
				{/* {
					categorySelected.map((item)=>{
						return(
						<h4>{`${item.category}: ${item.vote_count}`}</h4>
						)
					})
				} */}
				{!isReady ? 
					<div style={{width: "100%", paddingRight: "40px", paddingLeft: "40px"}}><Button 
						onClick={()=>{readyUp()}}
						style={{width: "100%", marginTop: "1rem"}} 
						variant="primary">
						Ready
					</Button></div>
					: <h4 style={{textAlign: "center", color: "yellow"}}>Waiting for others to ready up...</h4>
				}
				
			</div>
		</Container>
	)
}

export default Readying;