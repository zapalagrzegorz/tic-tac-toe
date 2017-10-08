/**
 * Klasa odpowiadająca za logikę komputera 
 */
class Computer {
    constructor () {
        // kluczowa tablica przechowująca 'najlepszy' ruch
        this.choice = [];
    }
    /**
     * Zwraca wartość liczbową określającą stan gry:
     * 1 - wygrał gracz, '-1' - wygrał komputer, 0 - remis
     * undefined - gdy gra nie została rozstrzygnięta
     * 
     * @param {object} game 
     * @return {number} The x value.
     */
    static getScore (game) {
        let draw = 0;
        let successPlayerVertical = 0;
        let successPlayerHorizontal = 0;
        let successOpponentVertical = 0;
        let successOpponentHorizontal = 0;
        let successPlayerDiagonal = 0;
        let successOpponentDiagonal = 0;
        let successPlayerDiagonalRev = 0;
        let successOpponentDiagonalRev = 0;

        // if game player cannot win, we could skip him
        // check column and row
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (game.board[i][j] === game.current) {
                    successPlayerVertical++;
                    if (successPlayerVertical === 3) {
                        // console.log('successPlayerVertical');
                        return 1;
                    }
                }
                if (game.board[j][i] === game.current) {
                    successPlayerHorizontal++;
                    if (successPlayerHorizontal === 3) {
                        // console.log('successPlayerHorizontal');
                        return 1;
                    }
                }
                if (game.board[i][j] === game.opponent) {
                    successOpponentVertical++;
                    if (successOpponentVertical === 3) {
                        // console.log('successOpponentVertical');
                        return -1;
                    }
                }
                if (game.board[j][i] === game.opponent) {
                    successOpponentHorizontal++;
                    if (successOpponentHorizontal === 3) {
                        // console.log('successOpponentHorizontal');
                        return -1;
                    }
                }
                if (game.board[i][j] !== 2) {
                    draw++;
                }
            }
            // clear after each row/column
            successPlayerVertical = successPlayerHorizontal = 0;
            successOpponentVertical = successOpponentHorizontal = 0;
        }

        // diagonal forward
        for (let i = 0; i < 3; i++) {
            if (game.board[i][i] === game.current) {
                successPlayerDiagonal++;
                if (successPlayerDiagonal === 3) {
                    // console.log('successPlayerDiagonal');
                    return 1;
                }
            }
            if (game.board[i][i] === game.opponent) {
                successOpponentDiagonal++;
                if (successOpponentDiagonal === 3) {
                    // console.log('successOpponentDiagonal');
                    return -1;
                }
            }
        }
        // diagonal backward
        for (let i = 2, j = 0; i >= 0; i--, j++) {
            if (game.board[i][j] === game.current) {
                successPlayerDiagonalRev++;
                if (successPlayerDiagonalRev === 3) {
                    // console.log('successPlayerDiagonalBackward');
                    return 1;
                }
            } else if (game.board[i][j] === game.opponent) {
                successOpponentDiagonalRev++;
                if (successOpponentDiagonalRev === 3) {
                    // console.log('successOpponentDiagonalRev');
                    return -1;
                }
            }
        }

        if (draw === 9) {
            return 0;
        } else {
            return undefined;
        }
    }

    /**
     * Zwraca tablicę dopuszczalnych ruchów
     * TODO zmienić na tablicę - obecnie jest obiekt
     * number[]
     * @param {Object} game 
     */
    getAvailableMoves (game) {
        let availableMoves = [];
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (game.board[i][j] === 2) {
                    availableMoves.push([i, j]);
                }
            }
        }
        return availableMoves;
    }
    /**
     * Funkcja pomocnicza dla algorytmu minimax
     * Generuje wariant stanu gry 
     * @param {number[]} move 
     * @param {Object} game 
     */
    getNewState (move, game) {
        // kopiowanie tworzy referencję
        // for(var prop in this){
        //     newGame[prop] = this[prop];
        // }
        // aby zrobić deep copy MDN rekomenduje parse i stringify obiektu JSON
        let newGame = JSON.parse(JSON.stringify(game));

        newGame.board[move[0]][move[1]] = newGame.activeTurn;
        // kolejny ruch wykonuje drugi z graczy
        newGame.activeTurn = (newGame.activeTurn === 1) ? 0 : 1;
        // newGame.notActive = (newGame.activeTurn === 1) ? 0 : 1;

        return newGame;
    }
    /**
     * 
     * Wyznacza ruch komputera na podstawie algorytmu minimax
     * Wynik jest zapisywany we właściwości choice
     * @param {object} game
     * @return {number} The x value.
     */
    minimax (game) {

        // return score if game over
        let score = Computer.getScore(game);
        if (score !== undefined) return score;

        let scores = [];
        let moves = [];

        // Populate the scores array, recursing as needed
        this.getAvailableMoves(game).forEach(function iterateMoves (move) {

            let possibleGame = this.getNewState(move, game);

            scores.push(this.minimax(possibleGame));

            moves.push(move);
        }, this);

        // Do the min or the max calculation
        // This is the max calculation
        // TODO - styl zmiennych i nazw funkcji
        // 
        if (game.activeTurn === game.current) {
            let max_score_index = scores.indexOf(Math.max(...scores));

            this.choice = moves[max_score_index];
            return scores[max_score_index];
        } else {

            // This is the min calculation
            let min_score_index = scores.indexOf(Math.min(...scores));
            this.choice = moves[min_score_index];
            return scores[min_score_index];
        }
    }
    /**
     * Ustala pierwszy ruch komputera. Inaczej obliczenia trwają ok. 5 sek. a wybór pada na narożnik.
     * @returns {object} HMTLelement
     */
    setFirstMove () {
        let possibleMoves = [
            [0, 0],
            [0, 2],
            [2, 0],
            [2, 2]
        ];
        const firstMove = Math.floor((Math.random() * 10 % 4));
        this.choice = possibleMoves[firstMove];
        const boardField = document.querySelector('[data-field="' + this.choice[0] + this.choice[1] + '"]');
        return boardField;
    }
    /**
     * Perform computer move
     * @param {object} game 
     */
    setMove (game) {
        game.current = game.computer;
        game.opponent = game.player;
        
        // TODO sprawdzić co się dzieje w minimaxie z activeTurn
        game.activeTurn = game.current;
        this.minimax(game);
        const boardField = document.querySelector('[data-field="' + this.choice[0] + this.choice[1] + '"]');
        game.setBoardField(boardField);
    }
}
