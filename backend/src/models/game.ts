import { prisma } from "../config/prisma";

export const createGame = async (roomId: string, player1: string) => {
    return prisma.game.create({
        data: {
            roomId,
            player1
        }
    })
}

export const getGameById = async (roomId: string) => {
    return prisma.game.findUniqueOrThrow({
        where: {
            roomId
        }
    })
}

export const updateGame = async (roomId: string, pgn: string) =>  {
    const game = await prisma.game.update({
        where: {
            roomId
        },
        data: {
            pgn
        }
    })

    return game;
}