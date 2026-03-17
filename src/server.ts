import express from 'express';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Track active rooms in memory to prevent duplicate headless instances
const activeRooms = new Set<string>();

app.post('/api/matchmake', (req, res) => {
    const gameMode = req.body.gameMode || 'classic';
    const betAmount = req.body.betAmount || '0';
    const requestedSessionId = req.body.sessionId; 
    const serverApiKey = req.body.serverApiKey;
    const nonceVerifier = req.body.nonceVerifier;
    const gameName = req.body.gameName || 'ChessGame';

    // Use requested ID if provided, otherwise generate a new one
    const roomId = requestedSessionId || `session_${Math.random().toString(36).substring(7)}`;

    // If the room already has a dedicated server running, just return the ID 
    // so the second player can join it without spawning a duplicate Unity instance.
    if (activeRooms.has(roomId)) {
        console.log(`[API] Room ${roomId} already exists. Directing player to join existing room.`);
        return res.json({ success: true, roomId: roomId, message: "Joined existing room" });
    }

    // Mark room as active
    activeRooms.add(roomId);

    // const unityExecutable = path.resolve(__dirname, '../unity-build/BetPeerGames.x86_64');
    const unityExecutable = path.resolve(__dirname, '../unity-build-mac/BetPeerGames.app/Contents/MacOS/BetPeer');
    console.log(`[API] Spawning Unity server for room: ${roomId} | Mode: ${gameMode} | Bet: ${betAmount}`);

    const unityProcess = spawn(unityExecutable, [
        '-batchmode',
        '-nographics',
        '-roomID', roomId,
        '-gameName', gameName,
        '-gameMode', gameMode,
        '-betAmount', betAmount.toString(),
        '-serverSecret', serverApiKey || "default_dev_key", // Pass the secret
        '-nonceVerifier', nonceVerifier || "default_dev_nonce", // Pass the nonce verifier
        '-logfile', '/dev/stdout' 
    ]);

    unityProcess.stdout.on('data', (data) => {
        console.log(`[Unity ${roomId}]: ${data.toString().trim()}`);
    });

    unityProcess.on('close', (code) => {
        console.log(`[Unity ${roomId}] Process exited with code ${code}`);
        
        // Clean up the room tracking when the game ends or crashes
        // so the ID can be used again in the future if needed.
        activeRooms.delete(roomId);
    });

    // Return the room ID to the calling player so they can connect via PUN2
    res.json({ success: true, roomId: roomId, message: "Created new room" });
});

app.listen(PORT, () => {
    console.log(`Matchmaking server listening on port ${PORT}`);
});