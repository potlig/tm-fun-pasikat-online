import { mode } from "data/constants/constants";
import { headers } from "data/constants/constants";
import { localIP } from "data/constants/constants";
import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Fade from 'react-bootstrap/Fade';
import Finished from "./Finished";
import Readying from "./Readying";
import Timer from "./Timer";


const GameRoom=(props)=>{
	const {player_id, wrapperSendReady, timeStarted, categorySelected, questionSelected, isPlayer, isDone} = props;
	const [playerAnswer, setPlayerAnswer]= useState();
	const [done, setDone] = useState(isDone)
	const [emptyPlayerAnswer, setEmptyPlayerAnswer] = useState();
	const [displayWrongMessage, setDisplayWrongMessage] = useState(false)

	useEffect(()=>{
		const answer = questionSelected && questionSelected.length>0 ? questionSelected[0].answer:"";
		console.log(questionSelected)
		const answerArray = answer.split('');
		let answers = []
		let idCounter = 0;
		answerArray.map((item)=>{
			answers.push({id:idCounter, value: ""})
			idCounter++;
		});
		console.log("answers")
		setPlayerAnswer(answers);
		setEmptyPlayerAnswer(answers);

	},[questionSelected])

	
 	const handleKeyUp = (event, inputId) => {
		setDisplayWrongMessage(false);
		if (event.key === 'Backspace') {
			const getId = inputId-1;
			const previousInput = document.getElementById(getId);
			console.log(previousInput)
			if (previousInput) {
				previousInput.focus();
			}
		}
	};

	const submit= async()=>{
		let answer = "";
		playerAnswer.map(item => {
			answer = answer + item.value;
		})


		if(questionSelected[0].answer === answer){
			console.log(typeof timeStarted)
			console.log(new Date(timeStarted))
			let time = new Date - new Date(timeStarted)
 			time /= 1000;
		
			
			const method = "PUT";
			const body = {time: time, player_id: player_id, ready: true, finished: true};
			console.log(body)
			const url = `${localIP}/playerTime`;
			
			const response =await  fetch(url, {
				method: method,
				mode: mode,
				headers: headers,
				body: JSON.stringify(body)
				}).then(response => response.json())
				.then(data => {
					setDone(true);
				})
				.catch(error => {
					console.error('There was a problem with the Fetch operation:', error);
				})
			// console.log("minutes:"+minutes+" seconds: "+seconds);

		
		}
		else{
			setDisplayWrongMessage(true)
			setPlayerAnswer(emptyPlayerAnswer)
		}

	}

	const onChange=(event, id)=>{
		setDisplayWrongMessage(false);
		setPlayerAnswer([...playerAnswer].map(obj =>{
			if(obj.id === id){
				return {
					...obj,
					value: event.target.value.toUpperCase()
				}
			}
			else return obj;
		}))
		if(event.target.value){
			const nextInput = document.getElementById(id+1);
			console.log("nextInput")
			console.log(nextInput)
			if (nextInput) {
				nextInput.focus();
			}

		}
		
		
		
	}


	return(
	
		<div style={{marginLeft: "auto", marginRight:"auto"}}>
{!done ? <><div style={{textAlign:"center"}}>
			
			{categorySelected ? 
				<h1 style={{ color: "yellow", marginTop: "0"}}>{categorySelected.length > 0 ? categorySelected[0].category : null}</h1> : null
			}
			
			</div>
			
			<table style={{marginLeft: "auto", marginRight:"auto"}} >

				{questionSelected ? questionSelected.map(item=>{
					return(
					
					<div  style={{ zoom: "70%" }} >
						<tr>
							<th >
								<img style={{height: "150px", width: "150px", borderRadius: "20px", padding: "2px" }} src={item.image_1 !== "null"  ? `${localIP}/${item.image_1}`: ""}/>
							</th>
							<th>
								<img style={{height: "150px", width: "150px", borderRadius: "20px", padding: "2px" }} src={item.image_2 !== "null"  ? `${localIP}/${item.image_2}`: ""}/>
							</th>
						</tr>
							<tr>
							<th>
								<img style={{height: "150px", width: "150px", borderRadius: "20px", padding: "2px" }} src={item.image_3 !== "null"  ? `${localIP}/${item.image_3}`: ""}/>
							</th>
							<th>
								<img style={{height: "150px", width: "150px", borderRadius: "20px", padding: "2px" }} src={item.image_4 !== "null"  ? `${localIP}/${item.image_4}`: ""}/>
							</th>
						</tr> 
					</div> 
					)
				}): null}

			</table>
			<div style={{textAlign:"center", marginBottom:"2rem", marginTop: "2rem", marginLeft: "auto", marginRight:"auto", fontSize:"1rem" }}>
				{displayWrongMessage ? <div><h7 style={{color:"red"}}>Your answer is wrong please try again...</h7></div>: null}
				{playerAnswer?.map((item)=>{

					return(
						<input id={item.id} 	
						value={item.value}
						 onChange={(event)=>{onChange(event, item.id)}}
						 onKeyUp={(event)=>handleKeyUp(event, item.id)}
						style={{  textAlign:"center",borderRadius: "10px", marginLeft: "5px", marginTop: "1rem", height: "40px", width:"40px"}} maxLength="1"/>
					)
				})}
					
					<div style={{marginLeft:"auto", marginRight:"auto", textAlign:"center", marginTop:"1rem"}}>
						<Button  className="redbtn" onClick={()=>submit()}>Submit Answer</Button>
					</div>

				
			</div>
			</> : <Finished/>}
			
			
		</div>


	)
}


export default GameRoom;