/**
 * Klasa odpowiadająca za logikę komputera
 */
// export
class Computer {
    constructor () {
        // kluczowa tablica przechowująca 'najlepszy' ruch
        this.choice = [];
    }

    /**
     * Zwraca wartość liczbową określającą stan gry:
     * 1 - wygrał gracz, '-1' - wygrał komputer, 0 - remis
     * undefined - gdy gra się nie zakończyła
     *
     *  Przyjmuje obiekt game przechowujący informacje o grze
     *
     * @param {object} game
     * @return {number} The x value.
     */
    static getScore (game) {
        const winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];

        let draw;
        // weż każdą z tablic sprawdź czy wartość z listy kombinacji jest równa wartości tablicy gry dla x
        // jw. czy jest O

        function currentWin (currentValue) {
            return game.board[currentValue] === game.current;
        }

        function opponentWin (currentValue) {
            return game.board[currentValue] === game.opponent;
        }

        // sprawdź wartości na tablicy
        for (let i = 0, len = winCombos.length; i < len; i++) {
            if (winCombos[i].every(currentWin)) {
                return 1;
            } else if (winCombos[i].every(opponentWin)) {
                return -1;
            }
        }
        // check for draw
        draw = game.board.every((value, index) => {
            return game.board[index] !== 2;
        });
        if (draw) {
            return 0;
        }
        return undefined;
    }

    /**
     * Zwraca tablicę dopuszczalnych ruchów
     *
     * @param {number[]} game
     * @returns {number[]}
     */
    getAvailableMoves (board) {
        let availableMoves = [];
        board.forEach((element, index) => {
            if (element === 2) availableMoves.push(index);
        });
        return availableMoves;
    }

    /**
     * Funkcja pomocnicza dla algorytmu minimax
     * Generuje wariant stanu gry
     * @param {number} move
     * @param {Object} game
     */
    getNewState (move, game) {
        // kopiowanie tworzy referencję
        // for(var prop in this){
        //     newGame[prop] = this[prop];
        // }
        // aby zrobić deep copy MDN rekomenduje parse i stringify obiektu JSON
        let newGame = JSON.parse(JSON.stringify(game));

        newGame.board[move] = newGame.activeTurn;

        newGame.activeTurn = newGame.activeTurn === 1 ? 0 : 1;

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

        // Populate the scores indexay, recursing as needed
        this.getAvailableMoves(game.board).forEach(function iterateMoves (move) {
            let possibleGame = this.getNewState(move, game);

            scores.push(this.minimax(possibleGame));

            moves.push(move);
        }, this);

        // Do the min or the max calculation
        // This is the max calculation
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
     * Gets first move for computer
     * @return {number} pseudo-random first choice of computer
     *   minimax on empty table always generates place [0,0] as the best choice, but it takes around 5 secs
     *  to avoid that, generate pseudo-random move which is equivalent to that
     */
    setFirstMove () {
        let possibleMoves = [0, 2, 6, 8];
        let choice = Math.floor((Math.random() * 10) % 4);
        return possibleMoves[choice];
    }

    /**
     * Perform computer move
     * @param {object} game
     */
    setMove (game) {
        game.current = game.computer;
        game.opponent = game.player;
        game.activeTurn = game.current;

        this.minimax(game);
        /* sztuczne opóźnienie, aby komputer "udawał, że pracuje nad odpowiedzią" */
        setTimeout(() => {
            game.setBoardField(this.choice, 'computer');
        }, 1000);
    }
}
