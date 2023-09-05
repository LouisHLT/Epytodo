const connection = require('../../config/db');

async function createTodo (title, description, due_time, status, userId) {
    const [insertResult] = await connection.promise().query('INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)', [title, description, due_time, status, userId]);
    return insertResult.insertId;
}

async function getUserTasks(userId) {
    const [results] = await connection.promise().query('SELECT * FROM todo WHERE user_id = ?', [userId]);
    return results;
}

async function deleteTodoById(todoId) {
    const [results] = await connection.promise().query('DELETE FROM todo WHERE id = ?', [todoId]);
    return results;
}

async function getTodoById(todoId) {
    const [results] = await connection.promise().query(
        'SELECT title, description, due_time, status, user_id FROM todo WHERE id = ?',[todoId]);
    return results[0];
}

async function updateTask(id, title, description, due_time, status, user_id) {
    const [results] = await connection.promise().query('UPDATE todo SET title = ?, description = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?',
        [title, description, due_time, status, user_id, id]
    );
    return results.affectedRows;
}


module.exports = {
    createTodo,
    getUserTasks,
    deleteTodoById,
    getTodoById,
    updateTask
};
