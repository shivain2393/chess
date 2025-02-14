'use client';

import { Chessboard } from "react-chessboard"

interface ChessProps {
    playerRole: "white" | "black" | null;
}

const Chess = ({ playerRole } : ChessProps) => {
    console.log("Chessboard role", playerRole)

    return (
        <div className="w-[600px] h-[600px]">
            <Chessboard boardOrientation={playerRole || "white"}/>
        </div>
    )
}

export default Chess;