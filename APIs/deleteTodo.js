import { db } from '../db/index.js';
import { and, eq } from 'drizzle-orm'; // Tambahkan ini di file API utama kamu
import { todos } from '../db/schema.js';

const deleteTodo = async (c) => {
    // Di sini, 'authMiddleware' sudah memastikan user ada
    const user = c.get('user'); 
    const id = parseInt(c.req.param('id'));

    // Gunakan delete() Drizzle
    const deletedTodo = await db.delete(todos)
        .where(
            and(
                eq(todos.id, id),
                eq(todos.userId, user.id) // 🔑 HANYA HAPUS JIKA MILIKNYA
            )
        )
        .returning({ id: todos.id }); // Minta ID yang dihapus

    // Jika tidak ada baris yang dihapus (ID salah atau milik orang lain)
    if (deletedTodo.length === 0) {
        return c.json({ success: false, message: 'Todo not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Todo deleted successfully' });
}

export default deleteTodo