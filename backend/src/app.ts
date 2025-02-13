import express from 'express';
import cors from 'cors';
import gameRouter from './routes/gameRoutes';

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use('/api/game', gameRouter);

export default app;