import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './sockets/gameSocket';
import { PORT } from './config/env';

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

setupSocket(io);

server.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})