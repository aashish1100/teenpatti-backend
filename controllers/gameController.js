import Game from "../models/Game.js";

// CREATE NEW GAME
export const createGame = async (req, res) => {
  try {
    const { players, gameName } = req.body;

    // Initialize ledger as Map of Maps
    const ledger = new Map();

    players.forEach(from => {
      const inner = new Map();
      players.forEach(to => inner.set(to, 0));
      ledger.set(from, inner);
    });

    const game = await Game.create({
      players,
      gameName,
      ledger
    });

    res.json(game);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD ROUND TO GAME
export const addRound = async (req, res) => {
  try {
    const { id } = req.params;
    const { winner, losers } = req.body;

    const game = await Game.findById(id);

    game.rounds.push({ winner, losers });
    await game.save();

    res.json({ message: "Round added", game });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET LEDGER (Convert Map -> Normal JSON)
export const getLedger = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const players = game.players;
    const rounds = game.rounds;

    // Create normal ledger
    const ledger = {};
    players.forEach(p => {
      ledger[p] = {};
      players.forEach(q => (ledger[p][q] = 0));
    });

    // Fill ledger from rounds
    rounds.forEach(r => {
      const winner = r.winner;
      r.losers.forEach(l => {
        ledger[l.name][winner] += l.amount;
      });
    });

    // Compute net settlement
    const settlement = {};
    players.forEach(p => {
      settlement[p] = {};
      players.forEach(q => {
        if (p === q) {
          settlement[p][q] = 0;
        } else {
          settlement[p][q] = Math.max(
            ledger[p][q] - ledger[q][p],
            0
          );
        }
      });
    });

    res.json({ ledger, settlement, players });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL GAMES
export const getAllGames = async (req, res) => {
  const games = await Game.find().sort({ createdAt: -1 });
  res.json(games);
};

// GET GAME DETAILS
export const getGameDetails = async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.json(game);
};

// GET ROUND HISTORY
export const getRounds = async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.json(game.rounds);
};
