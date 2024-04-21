import { mode } from "data/constants/constants";
import { headers } from "data/constants/constants";
import { localIP } from "data/constants/constants";
import { ready } from "jquery";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Fade from 'react-bootstrap/Fade';
import background from '../assets/img/red-bg.jpg'

const ServerReadying=(props)=>{
	const [categorySelected, setCategorySelected] = useState([{}])
	


	fetch(`${localIP}/category-selected-full`)
	.then(response => response.json())
	.then(data =>{ setCategorySelected(data)
		console.log("data: "+ data)
	})



	return(
		<Container style={{backgroundImage: `url(${background})` ,position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}}  >
			<div>
				<p style={{textAlign: "center", color: "yellow", marginTop: "50%", fontSize: "100px"}}>Category</p>

				<h1 style={{textAlign: "center" , color: "yellow" , fontSize: "150px" }}> {categorySelected[0]?.category}</h1>
				{/* {
					categorySelected.map((item)=>{
						return(
						<h4>{`${item.category}: ${item.vote_count}`}</h4>
						)
					})
				} */}
			
				
			</div>
		</Container>
	)
}

export default ServerReadying;