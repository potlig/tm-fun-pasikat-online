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
const getPlayers=()=>{
	return pool.query('SELECT * FROM players ', (error, results) => {
    if (error) {
      throw error
    }
    return JSON.stringify( results.rows)
  })
}


module.exports = {
	getPlayers
}
