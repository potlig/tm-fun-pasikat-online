require("dotenv").config();
const wsFunctions = require("./functions/WebSocketFunctions")
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
const db = require('./queries')
var roomTimers = {}

const cors = require("cors");
const fs = require("fs");
const multer = require('multer');

const jwt = require("jsonwebtoken");

const duration = 30;


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

const io = require("socket.io")(8080, {
  cors: {
    origins: ['http://localhost:3000']
  }
})

const gameStatus = {
  waiting: "waiting",
  readying: "readying",
  play: "play",
  end: "end"
}

io.on("connection", socket =>{
  console.log(socket.id)

  const playerCount =async(roomName)=>{
    // const players = await io.in(roomName).engine.clientsCount;
    const clientsInRoom = io.sockets.adapter.rooms.get(roomName);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    console.log(numClients)
  }

  socket.on("create-room", data =>{
    socket.nickname = data.playerName;
    socket.join(data.roomName)
    console.log(`Room: "${data.roomName}" has been created by ${data.playerName}`)

    console.log("after create room")

  })

  // socket.on("get-status", data, callback=>{
  //   const roomName = data.roomName;

  // })
  socket.on("ready", async data =>{
    console.log("ready: "+data)
    const rooomName = data.roomName;
    await pool.query(`SELECT * FROM players WHERE ready = false AND room_name = $1;`,  [rooomName], (error, result) => {
      if (error) {
        console.error('Error executing the query:', error);
      } else {
        // Check if there are rows in the result
        // console.log(result.rows)
        if (result.rows.length === 0) {
            console.log(data)
            // updateRoomStatusPlay("play", data.room_id);
            const status = "play"
            let timeStart;
            pool.query('UPDATE room SET status = $1  WHERE room_name = $2', [status,data.roomName ], (error, results) => {
              if (error) {
                throw error
              }
              socket.to(data.roomName).emit("update-status");


              timeStart = new Date();

              console.log(timeStart);
              const duration = 10;
              let display ="";
              var time = duration, minutes, seconds;
              var timer = setInterval(function () {
                  minutes = parseInt(time / 60, 10);
                  seconds = parseInt(time % 60, 10);

                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  seconds = seconds < 10 ? "0" + seconds : seconds;

                  display = minutes + ":" + seconds;
                  const timeLeft = JSON.stringify({timeStarted: timeStart, timeRemaining: {minutes: minutes, seconds: seconds} })
                  console.log(JSON.stringify(data.roomName));
                  console.log(time);
                  // wss.clients.forEach(client => client.send(timeLeft));
                  
                  socket.to(data.roomName).emit("time-left",timeLeft);
                  roomTimers[data.roomName]= timer
                  if (time  <= 0) {

                    console.log(roomTimers[data.roomName])
                    clearInterval(roomTimers[data.roomName]);
                    const endStatus = "end"
                    pool.query('UPDATE room SET status = $1  WHERE room_name = $2', [endStatus,data.roomName ], (error, results) => {
                      if (error) {
                        throw error
                      }
                      socket.to(data.roomName).emit("update-status");
                      // isReset = false;
                    })
                    // currentStatus= status.end;
                    // console.log(`current status: ${currentStatus}`);
                    // const statusMessage = {currentStatus: currentStatus};
                    // wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));

                  }
                  else{
                    time--;
                  }
                
              }, 1000);
            })
        } else {
          // wss.clients.forEach(client => client.send(JSON.stringify( {currentStatus: currentStatus, message: "readied"})));
          socket.to(data.roomName).emit("update-status");
        }
      }
    });
    
  })
  
  socket.on("start-game", data=>{
    console.log("Room: "+data+" will start")
    socket.to(data.roomName).emit("game-start");
    console.log("after send")
    // start game
    // timer start
    // end timer
  })

  socket.on("reset", data=>{
    console.log(data)
    // clearInterval(roomTimers[data.roomName]);
    console.log("reset")
    socket.to(data.roomName).emit("reset-game");
  })

  socket.on("join-room", data =>{
    // check if room exists
      socket.nickname = data.playerName;
      socket.join(data.roomName)

      console.log(`${socket.id} has joined`)
      
      const joinedMessage = `player: ${data.playerName} has Joined room: ${data.roomName}`
      console.log(joinedMessage)

      // Tell the admin client that a player just joined
      // const serverMessage = {status: "userConnected", roomName: data.roomName}
      const clientsInRoom = io.sockets.adapter.rooms.get(data.roomName);
      const numClients = clientsInRoom ? clientsInRoom.size : 0;
      console.log(numClients)
      socket.to(data.roomName).emit("player-joined", numClients );
      socket.to(data.roomName).emit("update-status");
      console.log("after join room")
    // console.log(`There are currently ${players.count}`)
    // socket.to(data.roomName).emit("log", `${socket.id} has joined room: ${roomName}`);
  })

  socket.on("update-status", data =>{
    socket.to(data.roomName).emit("update-status");
  })


})

const updateRoomStatusPlay = (room)=>{
    console.log(room )
    const status = "play"
    pool.query('UPDATE room SET status = $1  WHERE room_name = $2', [status, room.roomName ], (error, results) => {
      if (error) {
        throw error
      }
    })
}


// Websocket

 
  // const WebSocket = require("ws");
  
  // const wss = new WebSocket.Server({port: 8080});
  // let currentStatus="waiting";
  // let timeStart;
  // wss.on("connection", ws =>{

  // // status:
  // // 1. waiting - waiting for players to join
  // // 2. start - stop waiting and go to select categories
  // // 3. categories - selecting categories
  // // 4. play - start playing the game
  // // 5. end - the games end

  //   const status = { waiting:"waiting",start: "start", categories: "categories", readying: "readying", play: "play", end: "end", reset:"reset" }

  //   // console.log("New Client Connected!");
  //   // const message = {message: "newUser"}
  //   // wss.clients.forEach(client => client.send(JSON.stringify(message)));
  //   wss.clients.forEach(client => client.send(JSON.stringify( {currentStatus: currentStatus, message: "userConnected"})));
  //   console.log(currentStatus);
  //     ws.on('message', function message(data) {  
  //       console.log(data.toString())
  //       if(data.toString()==="reset"){
  //         currentStatus= status.waiting;
  //         console.log(`current status: ${currentStatus}`);
  //         const statusMessage = {message: "reset", currentStatus: currentStatus};
  //         wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //       }
  //       if(data.toString()==="readyUp"){
          
  //         pool.query(`SELECT * FROM players WHERE ready = false;`, (error, result) => {
  //           if (error) {
  //             console.error('Error executing the query:', error);
  //           } else {
  //             // Check if there are rows in the result
  //             console.log(result.rows)
  //             if (result.rows.length === 0) {
  //                 currentStatus= status.play;
  //                 console.log(`current status: ${currentStatus}`);
  //                 const statusMessage = {currentStatus: currentStatus};
  //                 wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));

  //                 timeStart = new Date();

  //                 console.log(timeStart);
  //                 const duration = 30;
  //                 let display ="";
  //                 var timer = duration, minutes, seconds;
  //                 var refreshIntervalId = setInterval(function () {
  //                     minutes = parseInt(timer / 60, 10);
  //                     seconds = parseInt(timer % 60, 10);

  //                     minutes = minutes < 10 ? "0" + minutes : minutes;
  //                     seconds = seconds < 10 ? "0" + seconds : seconds;

  //                     display = minutes + ":" + seconds;
  //                     const timeLeft = JSON.stringify({timeStarted: timeStart, timeRemaining: {minutes: minutes, seconds: seconds} })
  //                     console.log(JSON.stringify(timeLeft));
  //                     wss.clients.forEach(client => client.send(timeLeft));
  //                     if (--timer < 0) {
  //                       // timer = duration;
  //                       currentStatus= status.end;
  //                       console.log(`current status: ${currentStatus}`);
  //                       const statusMessage = {currentStatus: currentStatus};
  //                       wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //                       clearInterval(refreshIntervalId);
  //                     }
  //                 }, 1000);
  //             } else {
  //               wss.clients.forEach(client => client.send(JSON.stringify( {currentStatus: currentStatus, message: "readied"})));
  //             }
  //           }
  //         });
  //       }
  //       if(data.toString() === "waiting"){
  //         currentStatus= status.waiting;
  //         console.log(`current status: ${currentStatus}`);
  //         const statusMessage = {currentStatus: currentStatus};
  //         wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //       }
  //       if(data.toString() === "readying"){
  //         currentStatus= status.readying;
  //         console.log(`current status: ${currentStatus}`);
  //         const statusMessage = {currentStatus: currentStatus};
  //         wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));

  //         // duration in seconds
  //         // const duration = 10;
  //         // let display ="";
  //         // var timer = duration, minutes, seconds;
  //         // var refreshIntervalId = setInterval(function () {
  //         //     minutes = parseInt(timer / 60, 10);
  //         //     seconds = parseInt(timer % 60, 10);

  //         //     minutes = minutes < 10 ? "0" + minutes : minutes;
  //         //     seconds = seconds < 10 ? "0" + seconds : seconds;

  //         //     display = minutes + ":" + seconds;
  //         //     const timeLeft = JSON.stringify({timeRemaining: {minutes: minutes, seconds: seconds} })
  //         //     console.log(JSON.stringify(timeLeft));
  //         //     wss.clients.forEach(client => client.send(timeLeft));
  //         //     if (--timer < 0) {
  //         //       // timer = duration;
  //         //       currentStatus= status.readying;
  //         //       console.log(`current status: ${currentStatus}`);
  //         //       const statusMessage = {currentStatus: currentStatus};
  //         //       wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //         //       clearInterval(refreshIntervalId);
  //         //     }
  //         // }, 1000);
  //       }
  //       // if(data.toString() === "categories"){
  //       //   currentStatus= status.categories;
  //       //   console.log(`current status: ${currentStatus}`);
  //       //   const statusstatusMessage = {currentStatus: currentStatus};
  //       //   wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));



  //       // }
  //       // if(data.toString() === "ready"){
  //       //   currentStatus= status.readying;
  //       //   console.log(`current status: ${currentStatus}`);
  //       //   const statusMessage = {currentStatus: currentStatus};
  //       //   wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //       // }
  //       if(data.toString() === "play"){
  //         currentStatus= status.play;
  //         console.log(`current status: ${currentStatus}`);
  //         const statusMessage = {currentStatus: currentStatus};
  //         wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));


  //       }
  //       if(data.toString() === "end"){
  //         currentStatus= status.end;
  //         console.log(`current status: ${currentStatus}`);
  //         const statusMessage = {currentStatus: currentStatus};
  //         wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //       }
  //       // Check server status
  //       if(data.toString() === "status"){
  //         console.log(`current status: ${currentStatus}`);
  //         const statusMessage = {currentStatus: currentStatus};
  //         wss.clients.forEach(client => client.send(JSON.stringify(statusMessage)));
  //       }
  //     });

  //   ws.on("close", ()=>{
  //     console.log("Client has disconnected");
  //   })
  // })




const fileFilter = (request, file, callback)=>{
  if(file.mimetype ==="image/jpeg" || file.mimetype ==="image/png" || file.mimetype ==="image/jpg"  ){
    callback(null, true);
  }
  else callback(null, false);
}

const storage = multer.diskStorage({
  destination: (req, file, callback)=>{
    const imagePath = `images/`
    
    fs.mkdirSync(imagePath, { recursive: true })

    callback(null, imagePath)
  },
  filename: (req, file, callback)=>{
    callback(null, `${generate_uuidv4()}${path.extname(file.originalname)}`);

  }
})

const upload = multer({storage: storage, fileFilter: fileFilter})

const path = require("path");
const { WebSocketServer } = require('ws')
const { response } = require("express")


function generate_uuidv4() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
   function(c) {
      var uuid = Math.random() * 16 | 0, v = c == 'x' ? uuid : (uuid & 0x3 | 0x8);
      return uuid.toString(16);
   });
}




app.use(cors())
.use("/images", express.static("images"))
.use(bodyParser.json())
.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.get("/users", authenticationToken, async (request, response) => {
  await pool.query("SELECT * FROM users", async (error, results) => {
    if (error) {
      response.status(500).send(error);
    }
    response.status(201).send(results.rows);
  });
});

app.post("/users", async (request, response) => {
  const { username, password, isAdmin } = request.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (username, password, is_admin) VALUES ($1,$2, $3) RETURNING *",
        [username, password, isAdmin],
        async (error, results) => {
          if (error) {
            response.status(500).send(error);
          }
          await pool.query("SELECT * FROM users", (error, results2) => {
            if (error) {
              response.status(500).send(error);
            }

            response.status(201).send(results2.rows);
          });
        }
      );
  } catch {
    response.status(500).send();
  }
});

app.put("/users", async (request, response) => {
  const { user_id, username, password } = request.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      "UPDATE users SET username = $1, password = $2 WHERE user_id = $3 RETURNING *",
      [username, password, user_id],
      (error, results) => {
        if (error) {
          response.status(500).send(error);
        }
        response.status(201).send(results.rows);
      }
    );
  } catch {
    response.status(500).send();
  }
});

app.post("/login", async (request, response) => {
  const { username, password, rememberMe } = request.body;
	console.log(username)
  await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    async (error, results) => {

    	if (error) {
			console.log('error')
        	response.status(500).send(error);
      	}
      	if (results.rowCount > 0) {
	
        	try {
          		if (password === results.rows[0].password) {
                	
            		const user = {
              		user_id: results.rows[0].user_id,
              		exhibitor_id: results.rows[0].exhibitor_id,
              		is_admin: results.rows[0].is_admin,
            		};

					const accessToken = generateAccessToken(user);
		      console.log(accessToken)
					const refreshToken = jwt.sign(
						user,
						process.env.REFRESH_TOKEN_SECRET
					);
					console.log(user.user_id)
					try{
						await pool.query(
						`INSERT INTO refresh_tokens (user_id, refresh_token) 
						VALUES ($1, $2) 
						ON CONFLICT (user_id)
						DO UPDATE SET refresh_token = $2`,
						[user.user_id, refreshToken]
						);
					}catch(err){
						console.log(err)
					}
					

					response.json({
						user_id: user.user_id,
						exhibitor_id: user.exhibitor_id,
						is_admin: user.is_admin,
            username: username,
						accessToken: accessToken,
						refreshToken: refreshToken,
					});
				} else {
					response.status(201).send("Invalid Password");
        		}
        	} 
			catch {
          		response.status(500);
        	}
      	} else {
        	response.status(400).send("User not found");
      	}
    }
  );
});

app.post("token", async (request, response) => {
  const { refreshToken } = request.body;
  if (refreshToken == null) return response.sendStatus(401);
  await pool.query(
    `SELECT * from refresh_tokens WHERE refresh_token = $1 LIMIT 1`,
    [refreshToken],
    async (error, results) => {
      if (error) {
        response.status(500).send(error);
      }
      if (results.rowCount > 0) {
        if (results.rows[0].refreshToken === refreshToken) {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, user) => {
              if (error) return response.status(403);
              const accessToken = generateAccessToken({
                user_id: user.user_id,
                exhibitor_id: user.exhibitor_id,
                is_admin: user.is_admin,
              });

              response.json({
                user_id: user.user_id,
                exhibitor_id: user.exhibitor_id,
                is_admin: user.is_admin,
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            }
          );
        }
      }
    }
  );
});

app.delete("/logout", async (request, response) => {
  const { refreshToken } = request.body.refreshToken;

  await pool.query(
    `DELETE FROM refresh_tokens WHERE refresh_token = $1`,
    [refreshToken],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      }
      response.sendStatus(204);
    }
  );
});

function authenticationToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return response.senStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return response.sendStatus(403);
    request.user = user;
    next();
  });
}

function generateAccessToken(user, rememberMe) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "365y",
  });
  
}

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/players', db.getPlayers)
app.get('/playersByRoom',db.getPlayersByRoom)
app.get('/playerById', db.getPlayersById)
app.delete('/players', db.clearPlayers)

app.get('/category', db.getCategories)

app.get('/category', db.getPlayers)
app.post('/category-selected', db.insertCategorySelected)
app.get('/category-selected', db.getCategorySelected)
app.get('/category-selected-full', db.getCategorySelectedFull)
app.delete('/category-selected', db.clearCategorySelected)

app.delete('/category', db.deleteCategory)

app.post('/players', db.createPlayer)

app.post('/category', db.createCategory)

app.post('/question', db.createQuestion)

app.put('/playerTime', db.updatePlayerTime)

app.put('/question',  upload.fields( [ {name:"image_1"},{ name: "image_2"},{name:"image_3"},{ name: "image_4"}]), (req, res)=>{
  console.log( req.files)
  console.log( req.body)

    const data = {
      question_id: req.body.question_id,
      answer: req.body.answer,
      image_1: req.files?.image_1 ? `${req.files.image_1[0].destination}${req.files.image_1[0].filename}`: req.body.image_1 ??"",
      image_2: req.files?.image_2 ? `${req.files.image_2[0].destination}${req.files.image_2[0].filename}`: req.body.image_2 ??"",
      image_3: req.files?.image_3 ? `${req.files.image_3[0].destination}${req.files.image_3[0].filename}`: req.body.image_3 ??"",
      image_4: req.files?.image_4 ? `${req.files.image_4[0].destination}${req.files.image_4[0].filename}`: req.body.image_4 ??"",
    }
  
  if(data.image_1 && req.body.prevImage1){
    fs.unlink(req.body.prevImage1)
  }
  console.log(data);
  db.updateQuestions(data, res)
})

app.put('/category', db.updateCategory)

// questions
app.get('/question', db.getQuestions);

app.post('/question', db.createQuestion);

app.delete('/question', db.deleteQuestions)

// Ready
app.post('/ready', db.insertReady);
app.get('/ready', db.insertReady);
app.delete('/ready', db.clearReady);


// Category Selected
app.get('/category-selected-room', db.getCategorySelectedByRoom);

app.post('/question-selected', db.insertIntoQuestionSelected);
app.delete('/question-selected', db.clearQuestionSelected);
app.get('/question-selected-full', db.getQuestionSelectedFull);
app.get('/players-score', db.getPlayersScore)
app.get('/question-selected-room', db.getQuestionSelectedByRoom);
app.post('/create-room', db.createRoom)
app.get('/getRoom', db.getRoom)
app.get('/roomByUserId', db.getRoomByUserId)
app.post('/update-room-status', db.updateRoomStatus)

app.post('/reset', db.reset)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})