import { Container, Row } from "react-bootstrap";

const { QRCodeSVG } = require("qrcode.react")


const Waiting=(props)=>{
	const {players} = props;
	return(
		<Container fluid style={{ textAlign:"center",
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}}>

				<h1 className="waiting" style={{textAlign:"center"}}>Waiting for game to start...</h1>


		</Container>

	)
}

export default Waiting;