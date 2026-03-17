export class CheckersGame {
    public roomId: string;
    public gameState: number = 0;      
    public gameMode: number = 1;       
    public currentPlayer: number = 0;  // 0: Red, 1: Black
    public moveHistory: string = '{"moves":[]}';
    public playerTimes: string = '{}';
    public playerPoints: string = '{"player1Points":0,"player2Points":0}';
    public playerIds: string[] = ['', '']; // [redPlayerId, blackPlayerId]
    public winnerId: string = '';
    public lastPlayerToUpdate: string = '';
    public isUpdated: boolean = false;
    public interval: number = 1000; // 1 second

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    public startInterval() {
        setInterval(() => {
            if (this.isUpdated) this.isUpdated = false;
            else {
                this.gameState = 2;
                this.currentPlayer = 0;
                this.winnerId = this.currentPlayer === 0 ? this.playerIds[1] : this.playerIds[0]; // Opponent wins
            }
        }, this.interval);
    }

    public updateState(newState: Partial<CheckersGame>) {
        if (newState.gameState !== undefined) this.gameState = newState.gameState;
        if (newState.currentPlayer !== undefined) this.currentPlayer = newState.currentPlayer;
        if (newState.moveHistory !== undefined) this.moveHistory = newState.moveHistory;
        if (newState.playerTimes !== undefined) this.playerTimes = newState.playerTimes;
        if (newState.playerPoints !== undefined) this.playerPoints = newState.playerPoints;
        if (newState.playerIds !== undefined) this.playerIds = newState.playerIds;
        if (newState.lastPlayerToUpdate !== undefined) this.lastPlayerToUpdate = newState.lastPlayerToUpdate;
        if (newState.interval !== undefined) this.interval = newState.interval;
        
        this.isUpdated = true;
        this.startInterval();
    }

    public getState() {
        return {
            gameState: this.gameState,
            gameMode: this.gameMode,
            currentPlayer: this.currentPlayer,
            moveHistory: this.moveHistory,
            playerTimeSnapshot: this.playerTimes,
            playerPoints: this.playerPoints,
            playerIds: this.playerIds,
            winnerId: this.winnerId,
            lastPlayerToUpdate: this.lastPlayerToUpdate,
            isUpdated: this.isUpdated
        };
    }
}