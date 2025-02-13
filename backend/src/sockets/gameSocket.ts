import { Server } from "socket.io";
import { updateGame, getGameById } from "../models/game";
import { prisma } from "../config/prisma";
import { validateMoves } from "../utils/chess";
import { PlayerRole } from "@prisma/client";

export const setupSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("connect_error", (error) => {
            console.error(`Connection erorr: ${error.message}`)
        })

        socket.on("joinRoom", async ({ roomId } : { roomId: string }) => {  
            const game = await getGameById(roomId);
            const userId = socket.id;

            if(!game) {
                socket.emit("error", {
                    message: "Game not found"
                })
                return;
            }

            if(game.player1 && game.player2) {
                socket.emit("roomFull", {
                    message: "Room is already full"
                })
                return;
            }

            if(!game.player2 && game.player1 !== userId){
                const isWhitePlayer1 = Math.random() < 0.5;
                await prisma.game.update({
                    where: {
                        roomId
                    },
                    data: {
                        player2: userId,
                        white: isWhitePlayer1 ? "player1" : "player2",
                        black: isWhitePlayer1 ? "player2" : "player1"
                    }
                })
            }

            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);

            const updatedGame = await getGameById(roomId);

            if(updatedGame.player1 && updatedGame.player2) {
                if(updatedGame.white === PlayerRole.player1) {
                    io.to(updatedGame.player1).emit("playerRole", {
                        message: "You are white",
                    })
                    io.to(updatedGame.player2).emit("playerRole", {
                        message: "You are black",
                    })
                } else {
                    io.to(updatedGame.player1).emit("playerRole", {
                        message: "You are black",
                    })
                    io.to(updatedGame.player2).emit("playerRole", {
                        message: "You are white",
                    })
                }
            }
        });

        socket.on("move", async ({ roomId, move } : { roomId: string, move: string }) => {
            try {
                const game = await getGameById(roomId);
                let player : PlayerRole | null = socket.id === game.player1 ? 'player1' : 'player2'
    
                if(!game) {
                    socket.emit("error", {
                        message: "Game not found"
                    })
                    return;
                }
    
                if(!player) {
                    socket.emit("error", {
                        message: "You are not a player in this game"
                    })
                    return;
                }

                if(game.result && game.result !== "ongoing"){
                    socket.emit("error", {
                        message: `Game is already over ${game.result}`
                    })
                }
    
                const updatedGame = await validateMoves(game, player, socket, move);
                
                if(!updatedGame) {
                    return;
                }
    
                io.to(roomId).emit("gameState", updatedGame.pgn);

                if(updatedGame.result && updatedGame.result !== "ongoing") {
                    io.to(roomId).emit("gameOver", {
                        message: `Game over: ${updatedGame.result}`
                    })
                }

            } catch (error) {
                console.error("Error handling move event: ", error);
                socket.emit("error", {
                    message: "An error occured while processing the move"
                })
            } 
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
