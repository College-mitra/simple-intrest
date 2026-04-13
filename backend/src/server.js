import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();
await connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('group:join', (groupId) => socket.join(groupId));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on ${port}`));
