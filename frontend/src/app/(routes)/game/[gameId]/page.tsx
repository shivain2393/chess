"use client";

import Chess from "@/components/Chess";
import Loading from "@/components/Loading";
import { getSocket, setupSocketListeners } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const Game = () => {
  const params = useParams();
  const gameId = params.gameId as string;
  const [playerRole, setPlayerRole] = useState<"white" | "black" | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ isConnecting , setIsConnecting] = useState<boolean> (true);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        setIsConnecting(true);
        const socketInstance = await getSocket();

        if(!socketInstance) {
          console.error("Failed to connect to socket server");
          return;
        }

        setSocket(socketInstance);

        setupSocketListeners(socketInstance, {
          onPlayerRole: (role) => {
            setPlayerRole(role);
            setIsConnecting(false);
          }
        });

        socketInstance.emit("getPlayerRole", { roomId: gameId });

      } catch (error) {
        console.error("Socket Connection Error: ", error);
        setIsConnecting(false);
      }
    };

    if(gameId) {
      initializeSocket();
    }

    return () => {
      if(socket) {
        ["playerRole", "roomFull", "startGame", "gameState", "gameOver"].forEach(event => {
          socket.off(event);
        })
      }
    }
  }, [gameId]);

  return (
    <div className={cn(
      "container mx-auto flex flex-col items-center", 
      {
        "mt-40": playerRole === null
      }
    )}>
      {playerRole ? (
        <Chess playerRole={playerRole} socket={socket} gameId={gameId}/>
      ) : (
        <Loading>
          {isConnecting ? "Connecting to the game..." : "Waiting for opponent..."}
        </Loading>
      )}
    </div>
  );
};

export default Game;
