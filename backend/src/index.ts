import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './sockets/gameSocket';
import { FRONTEND_URL, PORT } from './config/env';

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL
    }
});

setupSocket(io);

server.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})