const Finished =()=>{
	return(
		<div style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)',
				textAlign: "center"}}>
			<h4 style={{color:"yellow", fontSize: "40px"}}>Congratulations!!</h4>
			<h4 style={{color:"yellow", fontSize: "30px"}}>Please wait for the game to finish</h4>
		</div>
	)
}

export default Finished;