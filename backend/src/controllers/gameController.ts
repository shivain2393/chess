import { Request, Response } from 'express';
import { createGame, getGameById } from '../models/game';
import { v4 as uuidv4} from 'uuid';

export const createGameRoom = async (req: Request, res: Response) => {
    const { player1 } = req.body;

    const roomId = uuidv4();
    const game = await createGame(roomId, player1);
    console.log(`A new game has been created with roomId: ${game.roomId}`)
    res.status(200).json({
        roomId,
        message: "Game created Successfully"
    })
}

export const getGame = async (req: Request, res: Response) : Promise<any> => {
    const { roomId } = req.params;
    
    const game = await getGameById(roomId);

    if(!game) return res.status(404).json({ message: "Game not found" });

    res.json(game);
}