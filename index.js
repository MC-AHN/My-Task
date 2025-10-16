import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './db/index.js';
import { users, todos } from './db/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'hono/cookie';
import { getCookie } from 'hono/cookie';
import { serveStatic } from '@hono/node-server/serve-static';
import { and, eq } from 'drizzle-orm'; // Tambahkan ini di file API utama kamu
import { isMiddleware } from 'hono/utils/handler';
import { auth } from 'hono/utils/basic-auth';

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }));

// Register 
app.post('/api/register', async (c) => {
    try {
        const { username, password } = await c.req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.insert(users).values({ username, password: hashedPassword }).returning({ id: users.id, username: users.username });

        return c.json({ success: true, data: newUser[0] }, 201);
    } catch (error) {
        return c.json({ success: false, message: 'Registrasi Gagal' }, 404);
    }
});

// Login
app.post('/api/login', async (c) => {
    const { username, password } = await c.req.json();
    const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.username, username) });

    if(!user) return c.json({ success: false, message: 'Username atau password salah' }, 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) return c.json({ success: false, message: 'Username atau Password salah'}, 401);

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    setCookie(c, 'token', token, { httpOnly: true, sameSite: 'Lax', maxAge: 3600 });

    return c.json({ success: true, message: 'Login Berhasil' });
})

// Authentication
app.get('/api/me', (c) => {
    const token = getCookie(c, 'token');
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401);
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return c.json({ success: true, data: user });
    } catch (error) {
        return c.json({ success: false, message: 'Unauthorized' }, 401);
    }
})

// Logout
app.post('/api/logout', (c) => {
    setCookie(c, 'token', '', { maxAge: -1 });
    return c.json({ success: true, message: 'Logout berhasil' });
});

// Api add Todo
app.post('/api/todos', async (c) => {
    const token = getCookie(c, 'token');
    if (!token) return c.json({ success: false, message: Unauthorized }, 401);
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { note } = await c.req.json();
        const newTodo = await db.insert(todos).values({ note, userId: user.id }).returning();
        return c.json({ success: true, data: newTodo[0] }, 201);
    } catch (error) {
        return c.json({ success: false, message: 'Unauthorized' }, 401);
    }
});

// Read Todo 
app.get('/api/todos', async (c) => {
    const token = getCookie(c, 'token');
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401);
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const userTodos = await db.query.todos.findMany({ where: (todos, { eq }) => eq(todos.userId, user.id )});
        return c.json({ success: true, data: userTodos });
    } catch (error) {
        return c.json({ success: false, message: 'Unauthorized' }, 401);
    }
})

const authMiddleware = async (c, next) => {
    // 1. Ambil Kunci (Token) dari Cookie
    const token = getCookie(c, 'token'); 
    
    // 2. Jika Kunci Hilang, Tolak Akses
    if (!token) {
        return c.json({ success: false, message: 'Unauthorized: Token is missing' }, 401);
    }
    
    try {
        // 3. Verifikasi Kunci dan Buka Isinya
        const userPayload = jwt.verify(token, process.env.JWT_SECRET); 
        
        // 4. Simpan Data User ke Konteks (Ini Intinya!)
        // Baris ini membuat const user = c.get('user') tidak undefined
        c.set('user', userPayload); 

        // 5. Lanjutkan ke Handler API (PUT/DELETE)
        await next(); 
        
    } catch (error) {
        // 6. Jika Kunci Palsu/Kedaluwarsa, Tolak Akses
        return c.json({ success: false, message: 'Unauthorized: Invalid token' }, 401);
    }
};

// Update Status 
app.put('api/todos/:id/status', authMiddleware, async (c) => { 
    try {
        const user = c.get('user');
        const id = parseInt(c.req.param('id')); 
        const { status } = await c.req.json(); 
        const updateTodo = await db.update(todos).set({ status }).where(and(eq(todos.id, id), eq(todos.userId, user.id))).returning()
        if(updateTodo.length === 0) return c.json({ success: false, message: 'Todo not found' }, 404);
        return c.json({ success: true, data: updateTodo[0] });
    } catch (error) {
        return c.json({ success: false, message: 'Unauthorized' }, 401);
    }
})

// Delete todo
// DI SERVER HONO/NODE.JS KAMU

app.delete('/api/todos/:id', authMiddleware, async (c) => {
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
});

// Run server

const port = 5002;
console.log(`🚀 Server is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port});

