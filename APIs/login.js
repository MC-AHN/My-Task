import { db } from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'hono/cookie';


const login = async (c) => {
    const { username, password } = await c.req.json();
    const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.username, username) });

    if(!user) return c.json({ success: false, message: 'Username atau password salah' }, 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) return c.json({ success: false, message: 'Username atau Password salah'}, 401);

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    setCookie(c, 'token', token, { httpOnly: true, sameSite: 'Lax', maxAge: 3600 });

    return c.json({ success: true, message: 'Login Berhasil' });
}

export default login