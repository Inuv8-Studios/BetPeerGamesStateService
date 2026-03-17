export class ChessGame {
    public roomId: string;
    public gameState: number = 0;       // 0: Loading, 1: Playing, 2: GameOver
    public gameMode: number = 1;        // 1: PvP
    public currentPlayer: number = 0;   // 0: White, 1: Black
    public moveHistory: string = '{"moves":[]}'; 
    public playerTimes: string = '{}';
    public playerPoints: string = '{"player1Points":0,"player2Points":0}';
    public capturedPieces: any[] = [];

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    // Accepts a partial state object from the Unity MasterClient and updates the Vault
    public updateState(newState: Partial<ChessGame>) {
        if (newState.gameState !== undefined) this.gameState = newState.gameState;
        if (newState.currentPlayer !== undefined) this.currentPlayer = newState.currentPlayer;
        if (newState.moveHistory !== undefined) this.moveHistory = newState.moveHistory;
        if (newState.playerTimes !== undefined) this.playerTimes = newState.playerTimes;
        if (newState.playerPoints !== undefined) this.playerPoints = newState.playerPoints;
        if (newState.capturedPieces !== undefined) this.capturedPieces = newState.capturedPieces;
    }

    // Returns the data formatted exactly how your C# GameData class expects it
    public getState() {
        return {
            gameState: this.gameState,
            gameMode: this.gameMode,
            currentPlayer: this.currentPlayer,
            moveHistory: this.moveHistory,
            playerTimes: this.playerTimes,
            playerPoints: this.playerPoints,
            capturedPieces: this.capturedPieces
        };
    }
}