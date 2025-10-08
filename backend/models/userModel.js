const pool = require('../config/db'); 
 
// Find user by email 
const findUserByEmail = async (email) => { 
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]); 
  return result.rows[0]; // return single user 
}; 
 
// Create user 
const createUser = async (user) => { 
  const { name, email, password } = user; 
  await pool.query( 
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', 
    [name, email, password] 
  ); 
}; 
 
// Save reset token 
const saveResetToken = async (email, token, expiry) => { 
  await pool.query( 
    'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3', 
    [token, expiry, email] 
  ); 
}; 
 
// Find user by reset token 
const findUserByResetToken = async (token) => { 
  const result = await pool.query( 
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()', 
    [token] 
  ); 
  return result.rows[0]; 
}; 
 
// Update password 
const updatePassword = async (userId, hashedPassword) => { 
  await pool.query( 
    'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2', 
    [hashedPassword, userId] 
  ); 
}; 
 
// Get user by id 
const findUserById = async (id, includePassword = false) => { 
  const fields = includePassword ? '*' : 'id, name, email'; 
  const result = await pool.query(`SELECT ${fields} FROM users WHERE id = $1`, [id]); 
  return result.rows; 
}; 
 
// Update name 
const updateUserName = async (id, name) => { 
  await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]); 
}; 
 
// Update email 
const updateUserEmail = async (id, email) => { 
  await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, id]); 
}; 
 
// Check if email exists excluding current user 
const findUserByEmailExcludingId = async (email, id) => { 
  const result = await pool.query( 
    'SELECT * FROM users WHERE email = $1 AND id != $2', 
    [email, id] 
  ); 
  return result.rows; 
}; 
 
// Update password (no reset) 
const updateUserPassword = async (id, hashedPassword) => { 
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]); 
}; 
 
module.exports = { 
  findUserByEmail, 
  createUser, 
  saveResetToken, 
  findUserByResetToken, 
  updatePassword, 
  findUserById, 
  updateUserName, 
  updateUserEmail, 
  findUserByEmailExcludingId, 
  updateUserPassword, 
};
