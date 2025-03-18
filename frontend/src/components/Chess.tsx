'use client';

import { useToast } from '@/hooks/use-toast';
import { setupSocketListeners } from '@/lib/socket';
import { Chess as ChessGame, Square } from 'chess.js';
import { useEffect, useRef, useState } from 'react';
import { Chessboard } from "react-chessboard";
import { Socket } from "socket.io-client";

interface ChessProps {
    playerRole: "white" | "black" | null;
    socket: Socket | null;
    gameId: string;
}

const TOAST_DURATION = 1000;

const Chess = ({ playerRole, socket, gameId } : ChessProps) => {
    const [game] = useState(new ChessGame());
    const [fen, setFen] = useState<string>(game.fen());
    const [kingSquare, setKingSquare] = useState<Square | null>(null);
    const [isGameOver, setIsGameOver] = useState<boolean> (false);
    const { toast } = useToast();
    const listenersSetupRef = useRef(false);

    useEffect(() => {
        if(!socket || listenersSetupRef.current) return;

        listenersSetupRef.current = true;

        setupSocketListeners(socket, {
            onGameState: (fen) => {
                game.load(fen);
                updateGameState();
            },
        });

        return () => {
            socket.off("gameState");
            socket.off("gameOver");
            listenersSetupRef.current = false;
        }

    }, [socket, game])


    const updateGameState = () => {
        setFen(game.fen());

        if(game.inCheck()) {
            const kingPosition = game.board().flat().find(
                (piece) => piece?.type === 'k' && piece.color === game.turn()
            )?.square;
            setKingSquare(kingPosition || null);
        } else {
            setKingSquare(null);
        }

        const gameOver = game.isGameOver();
        setIsGameOver(gameOver);

        if(gameOver){
            let message = "Game Over: ";

            if(game.isCheckmate()){
                message += "Checkmate"; 
            } else if(game.isStalemate()) {
                message += "Stalemate";
            } else if(game.isThreefoldRepetition()) {
                message += "Threefold Repetition";
            } else {
                message += "Draw due to insufficient material";
            }

            toast({
                title: message,
                duration: 3000
            })
        }
    }

    const handleMove = (move: { from: Square; to: Square; promotion?: string; }) => {
        if(!socket || !playerRole) return false;

        if((game.turn() === 'w' && playerRole !== 'white') || (game.turn() === 'b' && playerRole !=='black')) {
            toast({
                title: "Not your turn",
                variant: "destructive",
                duration: TOAST_DURATION
            })
            return false;
        }


        try {
            const moveResult = game.move(move);
    
            updateGameState();
    
            socket.emit("move", { roomId: gameId, move: moveResult.san})
    
            return true;
        } catch (error) {
            toast({
                title: "Invalid move",
                variant: "destructive",
                duration: TOAST_DURATION
            })
            return false;
        }
    }


    return (
        <div className="w-[600px] h-[600px]">
            <Chessboard 
             position={fen}
             onPieceDrop={(sourceSquare, targetSquare) => 
                handleMove({ from: sourceSquare, to: targetSquare })
             }
             isDraggablePiece={({ piece }) => {
                if(isGameOver || !playerRole) return false;
                const pieceColor = piece[0] === 'w' ? 'white' : 'black';

                return pieceColor === playerRole;
             }}
            customSquareStyles={{
                ...(kingSquare && game.inCheck() ? { [kingSquare]: { backgroundColor: 'rgba(255, 0, 0, 0.4)' } } : {})
            }}
            allowDragOutsideBoard={false}
             boardOrientation={playerRole || "white"}/>
        </div>
    )
}

export default Chess;