'use client';

import { useToast } from '@/hooks/use-toast';
import { setupSocketListeners } from '@/lib/socket';
import { Chess as ChessGame, Square } from 'chess.js';
import { useEffect, useState } from 'react';
import { Chessboard } from "react-chessboard";
import { Socket } from "socket.io-client";

interface ChessProps {
    playerRole: "white" | "black" | null;
    socket: Socket | null;
    gameId: any;
}

const TOAST_DURATION = 1000;

const Chess = ({ playerRole, socket, gameId } : ChessProps) => {
    const [game, setGame] = useState(new ChessGame());
    const [fen, setFen] = useState<string>(game.fen());
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
    const [kingSquare, setKingSquare] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<{ [square: string]: string }>({});
    const { toast } = useToast();


    useEffect(() => {
        if(!socket) return;

        setupSocketListeners(socket, {
            onGameState: (fen) => {
                game.load(fen);
                setFen(game.fen());
                checkGameStatus();
            }
        })
    }, [socket])

    const checkGameStatus = () => {
        setIsCheck(game.inCheck());
        setIsCheckMate(game.isCheckmate());

        if(game.inCheck()) {
            const kingPosition = game.board().flat().find((piece) => piece?.type === 'k' && piece.color === game.turn())?.square;
            setKingSquare(kingPosition || null);
        } else {
            setKingSquare(null);
        }
        
        if (game.isCheckmate()) {
            alert("Checkmate! Game Over.");
        } else if (game.isStalemate()) {
            alert("Game Over: Stalemate!");
        } else if (game.isThreefoldRepetition()) {
            alert("Game Over: Threefold Repetition!");
        } else if (game.isDraw()) {
            alert("Game Over: Draw due to insufficient material!");
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
    
            setFen(game.fen());
    
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
             isDraggablePiece={({ piece, sourceSquare }) => {
                if(!playerRole) return false;
                const pieceColor = piece[0] === 'w' ? 'white' : 'black';

                return pieceColor === playerRole;
             }}
             onPieceDragEnd={() => {
                setFen(game.fen()); // Ensures the board stays correct even if dragging is attempted
            }}
            allowDragOutsideBoard={false}
             boardOrientation={playerRole || "white"}/>
        </div>
    )
}

export default Chess;