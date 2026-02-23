export class GameState {
    constructor(startBalance = 1000) {
        this.balance = startBalance;
        this.currentBet = 10;
        this.minBet = 10;
        this.maxBet = 500;
    }

    increaseBet() {
        if (this.currentBet + 10 <= this.balance && this.currentBet + 10 <= this.maxBet) {
            this.currentBet += 10;
        }
        return this.currentBet;
    }

    decreaseBet() {
        if (this.currentBet - 10 >= this.minBet) {
            this.currentBet -= 10;
        }
        return this.currentBet;
    }

    canSpin() {
        return this.balance >= this.currentBet;
    }

    applySpinWin(amount) {
        this.balance += amount;
    }

    applySpinLoss() {
        this.balance -= this.currentBet;
    }
}