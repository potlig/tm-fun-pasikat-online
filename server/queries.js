const { response } = require('express')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})




// Players
const getPlayers = (request, response) => {
  
  pool.query('SELECT * FROM players ', (error, results) => {
    if (error) {
      throw error
    }
    
    response.status(200).json(results.rows)
  })
}

const getPlayersByRoom=(request, response)=>{
  const room_name = request.query.roomName
  if(room_name !== undefined){
    pool.query('SELECT * FROM players WHERE room_name = $1', [room_name], (error, results) => {
      if (error) {
        throw error
      }
      
      response.status(200).json(results.rows)
    })
  }

}

const getPlayersScore = (request, response) => {
  const room_name = request.query.roomName
  pool.query('SELECT * FROM players WHERE room_name = $1 ORDER BY time ', [room_name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getPlayersById = (request, response) => {
   const player_id = request.query.player_id
  pool.query('SELECT * FROM players WHERE player_id = $1', [player_id], (error, results) => {
    if (error) {

      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createPlayer = (request, response) => {
  const { name, ready, finished, roomName } = request.body
  if(!name) response.status(400).send(`Player name is empty`);
  pool.query('INSERT INTO players (name, ready, finished, room_name) VALUES ($1,$2,$3, $4) RETURNING *', [name, ready, finished, roomName], (error, results) => {
    if (error) {
        response.status(500).send(error)
    }
    response.status(201).send(results.rows)
  })
}

const clearPlayers = (request, response) => {
  pool.query('TRUNCATE players', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows)
  })
}


const updatePlayerTime = (request, response) => {
  const { player_id, ready, time, finished } = request.body
  pool.query(
    'UPDATE players SET time = $1, ready=$2, finished = $3 WHERE player_id = $4 RETURNING *',
    [time, ready, finished, player_id],
    (error, results) => {
      if (error) {
        throw error
      }
      pool.query('SELECT * FROM players ', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
  )
}


// Categories
const getCategories = (request, response)=>{
	pool.query('SELECT * FROM categories ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createCategory = (request, response) => {
  const { category } = request.body
  // if(!category) response.status(400).send(`Category is empty`);
  pool.query('INSERT INTO categories ( category) VALUES ($1) RETURNING *', [category], (error, results) => {
    if (error) {
      throw error
    }
    // Return all data
    pool.query('SELECT * FROM categories ', (error, categories) => {
      if (error) {
        throw error
      }
      response.status(200).json(categories.rows)
    })

  })
}


const updateCategory = (request, response) => {
  const { category, category_id } = request.body

  pool.query(
    'UPDATE categories SET category = $1 WHERE category_id = $2',
    [category, category_id],
    (error, results) => {
      if (error) {
        throw error
      }
      // Return all data
      pool.query('SELECT * FROM categories ', (error, categories) => {
        if (error) {
          throw error
        }
        response.status(200).json(categories.rows)
      })
    }
  )
}

const deleteCategory = (request, response) => {
  const { category_id } = request.body
  pool.query('DELETE FROM categories WHERE category_id = $1', [category_id], (error, results) => {
    if (error) {
      throw error
    }
    // Return all data
    pool.query('SELECT * FROM categories ', (error, categories) => {
      if (error) {
        throw error
      }
      response.status(200).json(categories.rows)
    })
  })
}

// Questions
const getQuestions = (request, response)=>{
	pool.query('SELECT * FROM questions', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
    
  })
}
const getQuestionByCategoryId = (request, response)=>{
	const category_id = request.body.category_id;
	pool.query('SELECT * FROM questions WHERE category_id= $1',[category_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const createQuestion = (request, response) => {
  const { category_id, answer, image_1, image_2, image_3, image_4 } = request.body
  if(!category_id) response.status(400).send(`Category is empty`);
  pool.query('INSERT INTO questions (category_id, answer) VALUES ($1, $2) RETURNING *', [category_id, answer], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('SELECT * FROM questions', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}



const updateQuestions = (data, response) => {

  pool.query(
    'UPDATE questions SET answer = $1, image_1=$2, image_2=$3, image_3=$4, image_4 =$5 WHERE question_id = $6',
    [data.answer, data.image_1, data.image_2, data.image_3, data.image_4, data.question_id],
    (error, results) => {
      if (error) {
        throw error
      }
      pool.query('SELECT * FROM questions', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
  )
}

const deleteQuestions = (request, response) => {
  const { question_id } = request.body
  pool.query('DELETE FROM questions WHERE question_id = $1', [question_id], (error, results) => {
    if (error) {
      throw error
    }
    // Return all data
    pool.query('SELECT * FROM questions ', (error, questions) => {
      if (error) {
        throw error
      }
      response.status(200).json(questions.rows)
    })
  })
}

// Category Selected
const getCategorySelected = (request, response)=>{
	pool.query('SELECT * FROM category_selected', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const getCategorySelectedFull = (request, response)=>{
	pool.query(`SELECT category_selected.category_selected_id, category_selected.category_id, category  FROM category_selected 
  INNER JOIN categories on category_selected.category_id = categories.category_id`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}




const getCategorySelectedByRoom = (request, response)=>{
  const roomID = request.query.roomID
	pool.query('SELECT * FROM category_selected WHERE room_id = $1', [roomID], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const clearCategorySelected =  (request, response) => {
  const { roomName, status, createdBy } = request.body
  pool.query('TRUNCATE Table category_selected', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const insertCategorySelected = (request, response) => {
  const { roomID } = request.body
  if(roomID!== undefined){
    
      pool.query(`INSERT INTO category_selected (category_id, room_id)
SELECT category_id, $1
FROM categories
ORDER BY RANDOM()
limit 1`, [roomID], (error, results) => {
    if (error) {
      throw error
    }
    pool.query(`SELECT category_selected_id, category_selected.category_id, category  FROM category_selected 
      INNER JOIN categories on category_selected.category_id = categories.category_id`, 
        (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
  })
  }

}

const insertIntoQuestionSelected = (request, response) => {
  const { category_id, roomID } = request.body
  // if(!category_id) response.status(400).send(`Category is empty`);
  pool.query(`INSERT INTO question_selected (question_id, room_id)
    SELECT question_id, $2
    FROM questions WHERE category_id = $1
	  ORDER BY random()
	  LIMIT 1`, [category_id, roomID], (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
  })
}

const reset =async (request, response) =>{
  const { roomID, roomName } = request.body
  await pool.query(`DELETE FROM question_selected 
    WHERE room_id = $1`, [roomID], (error, results) => {
    if (error) {
      throw error
    }
      // response.status(200).json(results.rows)
  })
  await pool.query(`DELETE FROM category_selected
    WHERE room_id = $1`, [roomID], (error, results) => {
    if (error) {
      throw error
    }
      // response.status(200).json(results.rows)
  })
  await pool.query(`DELETE FROM players WHERE room_name = $1`, [roomName], (error, results) => {
    if (error) {
      throw error
    }
      // response.status(200).json(results.rows)
  })
  await pool.query(`UPDATE room SET status='waiting' WHERE room_name = $1`, [roomName], (error, results) => {
    if (error) {
      throw error
    }
      // response.status(200).json(results.rows)
  })

}

const getQuestionSelectedByRoom = (request, response)=>{
  const roomID = request.query.roomID
  console.log("questionSelected")
  console.log(roomID)
	pool.query(`SELECT questions.question_id, questions.answer, questions.image_1, questions.image_2, questions.image_3, questions.image_4 
    FROM question_selected
    INNER JOIN questions on question_selected.question_id = questions.question_id
    WHERE question_selected.room_id = $1`, [roomID], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const clearQuestionSelected = (request, response) => {
  pool.query('TRUNCATE table question_selected ', (error, results) => {
    if (error) {
      throw error
    }
     response.status(200).json(results.rows)
  })
}

const getQuestionSelectedFull = (request, response)=>{
	pool.query(`SELECT questions.question_id, questions.answer, questions.image_1, questions.image_2, questions.image_3, questions.image_4 
    FROM question_selected
    INNER JOIN questions on question_selected.question_id = questions.question_id`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
// Ready
const insertReady = (request, response) => {
  const { player_id } = request.body
  if(!player_id) response.status(400).send(`Category is empty`);
  pool.query('INSERT INTO player_ready (player_id) VALUES ($1) RETURNING *', [player_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const clearReady = (request, response) => {
  pool.query('TRUNCATE table player_ready ', (error, results) => {
    if (error) {
      throw error
    }
     response.status(200).json(results.rows)
  })
}

const getReady = (request, response)=>{
	pool.query(`select player_ready_id, player_id, COUNT(player_ready_id) from player_ready
    GROUP BY player_ready_id, player_id`, 
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createRoom = (request, response)=>{
  const { roomName, status, createdBy } = request.body
  // if(!category_id) response.status(400).send(`Category is empty`);
  pool.query(`INSERT INTO room (room_name, status, created_by)
    VALUES ($1, 'waiting', $2) RETURNING *
    `, [roomName, createdBy], (error, results) => {
    if (error) {
      throw error
    }
      response.status(200).json(results.rows)
  })
}

const getRoom = (request, response)=>{
  const roomName = request.query.roomName
  if(roomName !== undefined){
    pool.query('SELECT * FROM room WHERE room_name = $1', [roomName], (error, results) => {
      if (error) {
        throw error
      }
      
      response.status(200).json(results.rows)
    })
  }
}

const getRoomByUserId = (request, response)=>{
  const user_id = request.query.user_id
  console.log("roomByuserID")
  console.log(user_id)
  if(user_id !== undefined){
    pool.query('SELECT * FROM room WHERE created_by = $1', [user_id], (error, results) => {
      if (error) {
        throw error
      }
      
      response.status(200).json(results.rows)
    })
  }
}

const updateRoomStatus = (request, response)=>{
  const {roomID, status} = request.body
    pool.query('UPDATE room SET status = $1  WHERE room_id = $2', [status, roomID ], (error, results) => {
      if (error) {
        throw error
      }
      
      response.status(200).json(results.rows)
    })
}


module.exports = {
	getPlayers,
	getCategories,
  getQuestions,
	getQuestionByCategoryId,
	createPlayer,
  createQuestion,
  createCategory,
	updatePlayerTime,
  updateCategory,
  updateQuestions,
	clearPlayers,
  deleteCategory,
  createQuestion,
  deleteQuestions,
  getPlayersById,
  getCategorySelected,
  getCategorySelectedFull,
  getCategorySelectedByRoom,
  insertCategorySelected,
  insertReady,
  clearCategorySelected,
  clearReady,
  insertIntoQuestionSelected,
  clearQuestionSelected,
  getQuestionSelectedFull,
  getPlayersScore,
  getPlayersByRoom,
  getQuestionSelectedByRoom,
  createRoom,
  getRoom,
  getRoomByUserId,
  updateRoomStatus,
  reset
}