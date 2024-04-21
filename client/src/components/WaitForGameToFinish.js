import { Container, Row } from "react-bootstrap";




const WaitForGameToFinish=(props)=>{
	const {players} = props;
	return(
		<Container >
			<Row className="justify-content-md-center">
				<h1 style={{textAlign:"center"}}>Game is currently udnderway</h1>
			</Row>
			{/* <Row className="justify-content-md-center">
				<h1 style={{textAlign:"center"}}>{players.players?.length} player(s) in room...</h1>
			</Row> */}
		</Container>

	)
}

export default WaitForGameToFinish;