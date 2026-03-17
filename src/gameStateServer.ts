import express from 'express';
import { ChessGame } from './games/chessGame';
import { CheckersGame } from './games/checkersGame';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// The Vault: Stores all active games in memory
const activeGames = new Map<string, ChessGame | CheckersGame>();

// MATCHMAKING & ROOM CREATION
app.post('/api/matchmake', (req, res) => {
    const gameMode = req.body.gameMode || 'classic';
    const betAmount = req.body.betAmount || '0';
    const requestedSessionId = req.body.sessionId; 
    const gameName = req.body.gameName || 'ChessGame';

    const roomId = requestedSessionId || `session_${Math.random().toString(36).substring(7)}`;

    if (activeGames.has(roomId)) {
        console.log(`[API] Room ${roomId} exists in vault. Directing player to join.`);
        return res.json({ success: true, roomId: roomId, message: "Joined existing room" });
    }

    // Create the lightweight state tracker instead of a Unity build
    let newGame;
    if (gameName === 'ChessGame') {
        newGame = new ChessGame(roomId);
    } else {
        newGame = new CheckersGame(roomId);
    }
    
    activeGames.set(roomId, newGame);
    console.log(`[API] Created Node.js State Tracker for room: ${roomId} | Game: ${gameName} | Bet: ${betAmount}`);

    res.json({ success: true, roomId: roomId, message: "Created new room state vault" });
});

// MASTERCLIENT PUSHES STATE UPDATES HERE
app.post('/api/gameState/:roomId/update', (req, res) => {
    const roomId = req.params.roomId;
    const game = activeGames.get(roomId);

    if (!game) {
        return res.status(404).json({ success: false, message: 'Game not found in vault.' });
    }

    // Update the vault with the latest payload from the Unity MasterClient
    game.updateState(req.body);
    
    // console.log(`[Vault Update] Room ${roomId} state secured.`);
    res.json({ success: true, state: game.getState() });
});

// RECONNECTING CLIENTS PULL STATE FROM HERE
app.get('/api/gameState/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const game = activeGames.get(roomId);

    if (!game) {
        return res.status(404).json({ success: false, message: 'Game not found in vault.' });
    }

    console.log(`[Vault Request] Serving state for Room ${roomId}`);
    res.json({ success: true, state: game.getState() });
});

// CLEANUP (Call this when a game naturally ends)
app.post('/api/gameState/:roomId/close', (req, res) => {
    const roomId = req.params.roomId;
    activeGames.delete(roomId);
    console.log(`[API] Room ${roomId} closed and cleared from vault.`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Game State Vault listening on port ${PORT}`);
});