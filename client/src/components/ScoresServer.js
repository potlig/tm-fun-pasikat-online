import { localIP } from "data/constants/constants";
import { useState } from "react";
import { useEffect } from "react";
import { Card, Container, Table } from "react-bootstrap";
import '../layouts/Applogin.css';
import background from '../assets/img/red-bg.jpg'
import background2 from '../assets/img/blue-bg.jpg'

const ScoresServer =  (props) =>{
	const {questionSelected, roomName } = props;
	
	const [players, setPlayers] = useState();

	useEffect(()=>{
		 fetch(`${localIP}/players-score?roomName=${roomName}`)
		.then(response => response.json())
		.then(data => {setPlayers(data)
			console.log(data)
		})
	},[])
	const convertTime =(seconds)=>{
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds% 60;
		return `${minutes} minutes ${remainingSeconds.toFixed()} second(s)`;

		return finalTime
	}
	function padTo2Digits(num) {
		return num.toString().padStart(2, '0');
	}

	function getOrdinal(number) {
	if (number === 0) return number; // Handle the case for 0 if needed
	const lastDigit = number % 10;
	const secondLastDigit = Math.floor((number % 100) / 10);

	if (secondLastDigit === 1) {
		return number + "th";
	}

	switch (lastDigit) {
		case 1:
		return number + "st";
		case 2:
		return number + "nd";
		case 3:
		return number + "rd";
		default:
		return number + "th";
	}
	}
	return (
		<div  style={{ width: "80%", height: "80%",
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}}>

			<div style={{textAlign: "Scores"}}>
				<h1 style={{color:"yellow", fontSize:"70px", marginTop:"30%"}}>Answer: {questionSelected? questionSelected[0].answer : null}</h1>
			</div>
			<div style={{textAlign: "Scores"}}>
				<h1 style={{color:"yellow", fontSize:"70px", marginTop:"30%"}}>Scores</h1>
			</div>

			
			<Table className="table-hover table-striped" style={{background: "white", fontSize: "20px"}}>
				<thead>
				<tr>
					<th  style={{ fontSize: "20px"}} className="border-0">Placement</th>
					<th  style={{ fontSize: "20px"}}  className="border-0">Name</th>
					<th style={{ fontSize: "20px"}}  className="border-0">Time</th>
				</tr>
				</thead>
				<tbody>
				 
					{players?.map((item, index)=>{
						return (
						<tr>
							<td style={{ fontSize: "18px"}}  >{getOrdinal(index+1)}</td>
							<td style={{ fontSize: "18px"}}  >{item.name}</td>
							<td style={{ fontSize: "18px"}}  >{item.finished ? convertTime(item.time) : "No Answer"}</td>

							
						</tr>
						)
					})}
				 
 
				</tbody>
			</Table>
		
		</div>
	)
}


export default ScoresServer;