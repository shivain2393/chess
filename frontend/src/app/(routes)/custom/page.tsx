"use client";

import { BACKEND_URL } from "@/config/env";
import { getSocket, setupSocketListeners } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import HighlightedText from "@/components/HighlightedText";

const CustomGame = () => {
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [joinRoomInput, setJoinRoomInput] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!clientSocket) return;

    setupSocketListeners(clientSocket, {
      onRoomFull: () => alert("Room is already full"),
      onGameStart: (roomId) => {
        if (!gameId) {
          setGameId(roomId);
        }

        router.push(`/game/${roomId}`);
      },
      onGameState: (pgn) => console.log("Game Updated:", pgn),
      onGameOver: (message) => alert(message),
    });
  }, [clientSocket]);

  const handleCreateBtnClick = async () => {
    const socket = await getSocket();
    setClientSocket(socket);

    try {
      if (!gameId) {
        const response = await fetch(`${BACKEND_URL}/api/game/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player1: socket.id,
          }),
        });

        const data = await response.json();

        if (!data) {
          throw new Error("Error while creating a game");
        }

        setGameId(data.roomId);
        socket.emit("joinRoom", { roomId: data.roomId });
      }
    } catch (error) {
      console.error("Error creating a game: ", error);
    }
  };

  const handleJoinGame = async () => {
    if (!joinRoomInput.trim()) {
      toast({
        title: "Please Enter valid Room Id.",
        variant: "destructive",
      });
      return;
    }

    const socket = await getSocket();
    setClientSocket(socket);

    socket.emit("joinRoom", { roomId: joinRoomInput });
  };

  const copyToClipboard = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      toast({
        title: "Room Id Copied",
        variant: "default",
        duration: 1000
      });
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center">
      <h1 className="text-4xl font-semibold max-w-2xl leading-relaxed">
        Set Up Your Own Chess Arena -{" "}
        <HighlightedText>Create</HighlightedText> or{" "}
        <HighlightedText>Join</HighlightedText> a Game
      </h1>
      <h2 className="text-lg max-w-2xl text-muted-foreground px-4">
        Create a custom game, share your Room ID, and{" "}
        <HighlightedText>challenge your friends</HighlightedText>—or jump
        into their game with their Room ID. Let the battles begin!
      </h2>
      <div className="flex gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-lg py-6 px-8 font-semibold"
              onClick={handleCreateBtnClick}
            >
              Create
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md flex flex-col">
            <DialogTitle className="text-center text-xl">
              Create Game
            </DialogTitle>
            <DialogDescription className="text-center">
              Share this Room Id with your friends
            </DialogDescription>
            <div className="flex gap-2 items-center">
              <Input value={gameId ?? ""} readOnly />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                className="px-3"
              >
                <Copy />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-lg py-6 px-8 font-semibold"
            >
              Join
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Join Game
              </DialogTitle>
            </DialogHeader>
            <Input
              value={joinRoomInput}
              onChange={(e) => setJoinRoomInput(e.target.value)}
              placeholder="Enter Room Id"
              type="text"
            />
            <Button onClick={handleJoinGame}>Join</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomGame;
