'use client';

import Button from "@/components/Button"
import { BACKEND_URL } from "@/config/env";
import { getSocket, setupSocketListeners } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const CustomGame = () => {
    const [clientSocket, setClientSocket] = useState<Socket | null> (null);
    const [gameId, setGameId] = useState<string | null>();
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
    const [joinRoomInput, setJoinRoomInput] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if(!clientSocket) return;

        setupSocketListeners(clientSocket, {
            onRoomFull: () => alert("Room is already full"),
            onGameStart: (roomId) => {
                if(!gameId) {
                    setGameId(roomId);
                }

                router.push(`/game/${roomId}`);
            },
            onGameState: (pgn) => console.log("Game Updated:", pgn),
            onGameOver: (message) => alert(message),
        });

    }, [clientSocket])


    const handleCreateBtnClick = async () => {

        const socket = await getSocket();
        setClientSocket(socket);
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/game/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    player1: socket.id
                })
            })

            const data = await response.json();

            if(!data) {
                throw new Error("Error while creating a game");
            }

            setGameId(data.roomId);
            setShowCreateModal(true);

            socket.emit("joinRoom", { roomId: data.roomId });
            
        } catch (error) {
            console.error("Error creating a game: ", error)
        }
    }

    const handleJoinBtnClick = () => {
        setShowJoinModal(true);
    }

    const handleJoinGame = async () => {
        if(!joinRoomInput.trim()) return alert("Please enter a valid Room Id");

        const socket = await getSocket();
        setClientSocket(socket);

        socket.emit("joinRoom", { roomId: joinRoomInput });

        setShowJoinModal(false);
    }

    const copyToClipboard = () => {
        if(gameId) {
            navigator.clipboard.writeText(gameId);
            alert("Room Id Copied")
        }
    }

    return (
        <div>
            <Button disabled={gameId !== null} onClick={handleCreateBtnClick}>Create</Button>
            <Button onClick={handleJoinBtnClick}>Join</Button>
            {/* Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[300px] text-center">
                        <h2 className="text-lg font-semibold mb-2">Game Room Created</h2>
                        <p className="text-gray-600 mb-4">Room ID: <span className="font-mono">{gameId}</span></p>
                        <Button onClick={copyToClipboard}>Copy Room ID</Button>
                        <Button className="mt-2 bg-red-500 hover:bg-red-600" onClick={() => setShowCreateModal(false)}>Close</Button>
                    </div>
                </div>
            )}

            {/* Join Game Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[300px] text-center">
                        <h2 className="text-lg font-semibold mb-2">Join Game</h2>
                        <input 
                            type="text" 
                            placeholder="Enter Room ID" 
                            value={joinRoomInput} 
                            onChange={(e) => setJoinRoomInput(e.target.value)} 
                            className="border rounded p-2 w-full mb-4"
                        />
                        <Button onClick={handleJoinGame}>Join Game</Button>
                        <Button className="mt-2 bg-red-500 hover:bg-red-600" onClick={() => setShowJoinModal(false)}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomGame;