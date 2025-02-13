import { Game, PlayerRole, Turn } from "@prisma/client";
import { Chess } from "chess.js";
import { Socket } from "socket.io";
import { prisma } from "../config/prisma";

export const validateMoves = async (game: Game, player: PlayerRole, socket: Socket, move: string) => {

    try {
        const chess = new Chess();
    
        if(game.pgn) chess.loadPgn(game.pgn);
    
        const isWhiteTurn = chess.turn() === 'w';
    
        if((isWhiteTurn && game.white !== player) || (!isWhiteTurn && game.black !== player)) {
            socket.emit('error', {
                message: "It's not your turn"
            })
            return null;
        }
    
        const result = chess.move(move, { strict: true })
        if(!result) {
            socket.emit("error", {
                message: "Invalid move"
            })
            return null;
        }
    
        const updatedPgn = chess.pgn();
    
        let gameStatus = "ongoing";
        if(chess.isCheckmate()) gameStatus = "checkmate";
        else if (chess.isDraw()) gameStatus = "draw";
        else if (chess.isStalemate()) gameStatus = "stalemate";
    
    
        return await prisma.game.update({
            where: {
                roomId: game.roomId
            }, 
            data: {
                pgn: updatedPgn,
                turn: isWhiteTurn ? Turn.black : Turn.white,
                result: gameStatus !== "ongoing" ? gameStatus : null
            }
        })
    } catch (error) {
        console.error(`Error in validating moves: ${error}`)
        socket.emit("error", { message: "An error occurred while processing your move" })
        return null;
    }
}