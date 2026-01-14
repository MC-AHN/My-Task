import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './db/index.js';
import { users, todos } from './db/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
import { serveStatic } from '@hono/node-server/serve-static';
import readTodo from './APIs/readTodo.js';
import updateStatus from './APIs/updateStatus.js';
import deleteTodo from './APIs/deleteTodo.js';
import logout from './APIs/logout.js';
import login from './APIs/login.js';


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
app.post('/api/login', login)

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

// Auth Function
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

// Logout
app.post('/api/logout', logout);

// Api add Todo
app.post('/api/todos', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const { note, deadline } = await c.req.json();
        const newTodo = await db.insert(todos).values({ note, deadline, userId: user.id}).returning();
        return c.json({ success: true, data: newTodo[0] }, 201);
    } catch (error) {
        return c.json({ success: false, message: `Erorr: ${error}` }, 401);
    }
});

// Read Todo 
app.get('/api/todos', authMiddleware, readTodo)

// Update Status 
app.put('/api/todos/:id/status', authMiddleware, updateStatus)

// Delete todo
app.delete('/api/todos/:id', authMiddleware, deleteTodo);

// Run server

const port = 5002;
console.log(`🚀 Server is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port});

