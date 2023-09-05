const connection = require('../../config/db');

async function getUserByEmail(email) {
    const [results] = await connection.promise().query(
      'SELECT id, email, password, created_at, firstname, name FROM user WHERE email = ?',
      [email]
    );
    return results;
}

async function registerUser(email, hashedPassword, name, firstname) {
    const [insertResult] = await connection.promise().query('INSERT INTO user (email, password, name, firstname, temp_user_token) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, name, firstname, '']);
    return insertResult.insertId;
}

async function updateUserToken(token, userId) {
    await connection.promise().query('UPDATE user SET temp_user_token = ? WHERE id = ?', [token, userId]);
}

async function getUserInfo(userId) {
    const [results] = await connection.promise().query(
      'SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?',
      [userId]
    );
    return results[0];
}

async function getUserTodo(userId) {
    const [results] = await connection.promise().query('SELECT * FROM todo WHERE user_id = ?', [userId]);
    return results;
}

async function getUserToken(userId) {
    const [results] = await connection.promise().query('SELECT temp_user_token FROM user WHERE id = ?', [userId]);
    return results[0].temp_user_token;
}

async function getUserById(userId) {
    const [results] = await connection.promise().query(
      'SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?',
      [userId]
    );
    return results[0];
}
async function deleteUserById(userId) {
    const [results] = await connection.promise().query('DELETE FROM user WHERE id = ?', [userId]);
    return results;
}

async function updateUserById(identifier, email, password, name, firstname) {
    const [results] = await connection.promise().query('UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
        [email, password, name, firstname, identifier]);
    return results.affectedRows;
}


module.exports = {
    deleteUserById,
    getUserByEmail,
    registerUser,
    updateUserToken,
    getUserInfo,
    getUserTodo,
    getUserToken,
    getUserById,
    updateUserById
};
