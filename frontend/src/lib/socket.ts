import { SOCKET_URL } from "@/config/env";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () : Socket => {
    if(!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            transports: ["websocket"]
        })

        socket.on("connect", () => {
            console.log("Connected to Web Socket server");
        })

        socket.on("disconnect", () => {
            console.log("Disconnected from Web Socket server");
            socket = null;
        })

        socket.on("error", (error) => {
            console.error("Socket Error: ", error);
        })
    }

    return socket;
}


export const getSocket = async () : Promise<Socket> => {
    const socket = connectSocket();

    if(!socket.connected){
        socket.connect();

        await new Promise<void>((resolve) => socket.once("connect", resolve));
    }

    return socket;
}

export const setupSocketListeners = (
    socket: Socket,
    callbacks: {
        onRoomFull?: () => void;
        onGameStart?: (roomId: string) => void;
        onPlayerRole?: (playerRole: "white" | "black") => void;
        onGameState?: (pgn: string) => void;
        onGameOver?: (message: string) => void;
    }
) => {
    socket.on("roomFull", () => {
        console.warn("Room is already full");
        callbacks.onRoomFull?.();
    })

    socket.on("startGame", ({ roomId }) => {
        console.log("Game stared in room: ", roomId);
        callbacks.onGameStart?.(roomId);
    })

    socket.on("playerRole", ({ playerRole }) => {
        console.log("Assigned Role: ", playerRole);
        callbacks.onPlayerRole?.(playerRole);
    })

    socket.on("gameState", (pgn) => {
        console.log("Game state updated", pgn);
        callbacks.onGameState?.(pgn);
    });

    socket.on("gameOver", ({ message }) => {
        console.log("Game Over:", message);
        callbacks.onGameOver?.(message);
    });
}