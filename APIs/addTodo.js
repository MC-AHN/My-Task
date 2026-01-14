import { db } from '../db/index.js';
import { todos } from '../db/schema.js';

const addTodo = async (c) => {
    try {
        const user = c.get('user');
        const { note, deadline } = await c.req.json();
        const newTodo = await db.insert(todos).values({ note, deadline, userId: user.id}).returning();
        return c.json({ success: true, data: newTodo[0] }, 201);
    } catch (error) {
        return c.json({ success: false, message: `Erorr: ${error}` }, 401);
    }
}

export default addTodo