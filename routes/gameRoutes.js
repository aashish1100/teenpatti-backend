import express from "express";
import {
  createGame,
  addRound,
  getLedger,
  getAllGames,
  getGameDetails,
  getRounds
} from "../controllers/gameController.js";

const router = express.Router();

router.post("/create", createGame);
router.post("/:id/add-round", addRound);

router.get("/all", getAllGames);
router.get("/:id/details", getGameDetails);
router.get("/:id/ledger", getLedger);
router.get("/:id/rounds", getRounds);

export default router;
    