import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => {
    return c.html('<h1>Tim Pengembang</h1><h2>Muhammad</h2>')
});

// jalankan server
const port = 5002;
console.log(`🚀 Server is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port});
