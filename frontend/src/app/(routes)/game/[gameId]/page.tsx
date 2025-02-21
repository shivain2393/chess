"use client";

import Chess from "@/components/Chess";
import Loading from "@/components/Loading";
import { getSocket, setupSocketListeners } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const Game = () => {
  const { gameId } = useParams();
  const [playerRole, setPlayerRole] = useState<"white" | "black" | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getPlayerRole = async () => {
      const socketInstance = await getSocket();
      setSocket(socketInstance);

      setupSocketListeners(socketInstance, {
        onPlayerRole: (role) => {
          setPlayerRole(role);
        },
      });

      socketInstance.emit("getPlayerRole", { roomId: gameId });
    };

    getPlayerRole();

    return () => {
      isMounted = false;
      if (socket) {
        socket.off("playerRole");
        socket.off("roomFull");
        socket.off("startGame");
        socket.off("gameState");
        socket.off("gameOver");
      }
    };
  });

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
          Loading Game
        </Loading>
      )}
    </div>
  );
};

export default Game;
