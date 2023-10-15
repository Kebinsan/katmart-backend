const { pool } = require("./dbConfig");

async function getUserByEmail(email) {
  try {
    const user = await pool.query(
      `SELECT * FROM users
    WHERE email = $1`,
      [email]
    );
    return user;
  } catch (err) {
    throw err;
  }
}

async function createNewUser(username, email, password) {
  try {
    const user = pool.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
                 RETURNING user_id, password`,
      [username, email, password]
    );
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getUserByEmail,
  createNewUser,
};
