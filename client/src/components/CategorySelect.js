import { localIP } from "data/constants/constants"
import React, {useState, useEffect} from "react"
import { Button, Container } from "react-bootstrap"

const CategorySelect = (props )=>{
	
	const [categories, setCategory] =useState()
	const {minutes, seconds, isPlayer} = props;
	const [voted, setVoted] = useState(false)
	// const timeLeft = `${timeRemaining.minutes}:${timeRemaining.seconds}`;
	console.log(props)
	useEffect(()=>{
		// Retrieve all Categories
		fetch(`${localIP}/category`)
		.then(response => response.json())
		.then(data => setCategory(data))
	},[])
	const voteCategory= async(category_id)=>{
		if(isPlayer){
			
			const method = "POST";
			const body = {category_id: category_id};
			const url = `${localIP}/category`;
			
			const response = await fetch(url, {
				method: method,
				mode: mode,
				headers: headers,
				body: JSON.stringify(body)
				}).then(response => response.json())
				.then(data => {
					setAllCategory(data);
					setVoted(true);
				})
				.catch(error => {
					console.error('There was a problem with the Fetch operation:', error);
			})
		}
	}
	return(
		<Container fluid>
			<h4>Time Remaining: {minutes}:{seconds}</h4>
			{voted ? <h3>Please wait for voting to finish</h3> : 
				<div>
					<h2 style={{textAlign:"center"}}>Select Categories</h2>		

					{
						categories?.map((item)=>{
							return(
								<div>
									<Button key={item.category_id} 
										onClick={()=>voteCategory(item.category_id)}
										style={{width: "100%", marginTop: "1rem" }} 
										variant="secondary">
										{item.category}
									</Button>
								</div>
							)
						})
					}
				</div>
			}
		</Container>
	)
}

export default CategorySelect;