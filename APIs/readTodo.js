import { db } from '../db/index.js';

const readTodo = async (c) => {
    try {
        const user = c.get('user');
        const userTodos = await db.query.todos.findMany({ where: (todos, { eq }) => eq(todos.userId, user.id )});
        return c.json({ success: true, data: userTodos });
    } catch (error) {
        return c.json({ success: false, message: 'Unauthorized' }, 401);
    }
}

export default readTodo