import { Router } from "express";
import { createGameRoom, getGame } from "../controllers/gameController";

const router = Router();

router.post("/create", createGameRoom);
router.get("/:roomId", getGame);

export default router;