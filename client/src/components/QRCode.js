import { Container, Row } from "react-bootstrap";
 
import background from '../assets/img/red-bg.jpg'
import {ip} from "../data/constants/constants";

const { QRCodeSVG } = require("qrcode.react")

const QRCode=(props)=>{
	const {players, roomName} = props;
	return(
		<Container style={{backgroundImage: `url(${background})`, textAlign:"center",
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'}} >
			<div style={{ paddingTop: "50%"}} >
				<QRCodeSVG style={{ height: "20rem", width: "20rem"}} value={`http://${ip}:3000/player-login?roomName=${roomName}`} level={"Q"} />
			</div>

			<div>
				<h1 style={{ color: "yellow"}}  >Scan To Join</h1>
			</div>
			<div>
				<h1  style={{ color: "yellow"}}  >Waiting for players</h1>
			</div>
			<div>
				<h1  style={{ color: "yellow"}} > {players?.length} player(s) in room...</h1>
			</div>
		</Container>

	)
}

export default QRCode;