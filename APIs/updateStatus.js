import { db } from '../db/index.js';
import { and, eq } from 'drizzle-orm'; // Tambahkan ini di file API utama kamu
import { todos } from '../db/schema.js';

const updateStatus = async (c) => { 
    try {
        const user = c.get('user');
        const id = parseInt(c.req.param('id')); 
        const { status } = await c.req.json(); 
        const completeAt = (status === 'completed') ? new Date().toISOString() : null
        const updateTodo = await db.update(todos).set({ status, completeAt }).where(and(eq(todos.id, id), eq(todos.userId, user.id))).returning()
        if(updateTodo.length === 0) return c.json({ success: false, message: 'Todo not found' }, 404);
        return c.json({ success: true, data: updateTodo[0] });
    } catch (error) {
        return c.json({ success: false, message: `Error: ${error}` }, 500);
    }
}

export default updateStatus