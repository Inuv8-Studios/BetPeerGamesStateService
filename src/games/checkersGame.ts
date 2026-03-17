export class CheckersGame {
    public roomId: string;
    public gameState: number = 0;      
    public gameMode: number = 1;       
    public currentPlayer: number = 0;  // 0: Red, 1: Black
    public moveHistory: string = '{"moves":[]}';
    public playerTimes: string = '{}';
    public playerPoints: string = '{"player1Points":0,"player2Points":0}';

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    public updateState(newState: Partial<CheckersGame>) {
        if (newState.gameState !== undefined) this.gameState = newState.gameState;
        if (newState.currentPlayer !== undefined) this.currentPlayer = newState.currentPlayer;
        if (newState.moveHistory !== undefined) this.moveHistory = newState.moveHistory;
        if (newState.playerTimes !== undefined) this.playerTimes = newState.playerTimes;
        if (newState.playerPoints !== undefined) this.playerPoints = newState.playerPoints;
    }

    public getState() {
        return {
            gameState: this.gameState,
            gameMode: this.gameMode,
            currentPlayer: this.currentPlayer,
            moveHistory: this.moveHistory,
            playerTimeSnapshot: this.playerTimes,
            playerPoints: this.playerPoints
        };
    }
}