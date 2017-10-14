// @ts-check

/**
 * @class Computer
 */
class Computer {
    constructor () {
        // kluczowa tablica przechowująca 'najlepszy' ruch
        this.choice;

    }

    /**
     * Zwraca wartość liczbową określającą stan gry:
     * 1 - wygrał gracz, '-1' - wygrał komputer, 0 - remis
     * undefined - gdy gra się nie zakończyła - [czy to ma sens]
     * 
     *  Przyjmuje obiekt game przechowujący informacje o grze 
     * 
     * 
     * Modyfikator static. Za MDN: Static method calls are made directly on the class and are not callable on instances of the class. Static methods are often used to create utility functions.
     * [czy to ma sens?! skoro klasę ]
     * 
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
        draw = game.board.every( (value, index) => {
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
        let choice = Math.floor((Math.random() * 10 % 4));
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
        game.setBoardField(this.choice, 'computer');
    }
}

class Game {
    constructor () {
        this.player = 0;
        this.computer = 0;
        this.current = 0;
        this.opponent = 1;
        this.activeTurn = 0;
        this.notActive = 0;
        this.board = [2, 2, 2, 2, 2, 2, 2, 2];
        this.result = 0;
        this.elements = {

            finalBox: document.querySelector('#finalBox'),
            modalBox: document.querySelector('.modal'),
            initTextBox: document.querySelector('#initBox'),
            finalBox__result: document.querySelector('#finalBox__result'),
            finalBox__tryAgain: document.querySelector('#finalBox__tryAgain'),
            playerCircle: document.querySelector('#playerCircle'),
            playerCross: document.querySelector('#playerCross'),
            boardFields: document.querySelectorAll('.board__field')

        };
        this.computerEngine = new Computer();
    }

    /**
     * TODO rozbudować o zmienną wskazującą, który gracz podejmuje działanie
     * Określa pole gracza na planszy 
     * @param {object} data HTMLelement
     * @param {string} playterType computer | player
     */
    setBoardField (data, playerType) {
        let _this = this;
        let boardField;
        let result;

        /**
         * Sprawdza czy ruch gracza jest prawidłowy
         * @param {object} chosenField to jest object, property MouseEvent.target pochodzący z event'u 'click' Player'a
         * @return {boolean}
         */
        function isPlayerValidMove (chosenField) {

            // czy zostało wybrane pole gry i czy jest nadal wolne
            if (chosenField.field !== undefined && _this.board[chosenField.field] === 2) {
                return true;
            }
        }

        /**
         * Zaznacza wybrane pole w DOM
         * @param {number} fieldIndex index of board field 
         */
        function setBoardFieldDOM (fieldIndex) {
            let boardField = document.querySelector('[data-field="' + fieldIndex + '"]');
            if (_this.current === 1) {
                boardField.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
            } else {
                boardField.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
            }
        }

        if (playerType === 'computer') {

            // zaznaczenie na planszy wewnętrznej
            this.board[data] = this.current;

            setBoardFieldDOM(data);

            result = Computer.getScore(this);
            if (result !== undefined) {
                this.prepareFinalBox(result);
            }

            this.current = this.player;
        // player
        } else {

            boardField = event.target;

            if (isPlayerValidMove(boardField.dataset)) {
                const boardTarget = boardField.dataset.field;
                this.board[boardTarget] = this.current;
                setBoardFieldDOM(boardTarget);

                result = Computer.getScore(this);
                if (result !== undefined) {
                    this.prepareFinalBox(result);
                } else {
                    this.computerEngine.setMove(this);
                }
            }
        }
    }

    /**
     * ustawia wartość gracza oraz komputera 
     * @param {number} choice
     */
    setPlayer (choice) {
        this.player = choice;
        this.computer = (this.player === 1) ? 0 : 1;

        this.animateInitBox();
        if (this.player === 1) {
            this.current = this.computer;
            this.opponent = this.player;
            this.setBoardField(this.computerEngine.setFirstMove(), 'computer');
        }
    }

    /**
     * wywołuje animację dla inicjalnego dialogu
     */
    animateInitBox () {
        this.elements.initTextBox.classList.toggle('visible');
        // chowanie modalu po animacji
        setTimeout(() => this.elements.modalBox.style.display = 'none', 1500);
    }

    /**
     * Wywołuje animację dla końcowego dialogu
     * @param {number} result 
     */
    prepareFinalBox (result) {
        const winner = result ? 'computer wins' : 'draw';
        this.elements.finalBox__result.textContent = winner;
        this.elements.modalBox.style.display = 'block';

        // zwykła funkcja tworzy scope w którym this jest undefined; indexow function przekazuje scope
        setTimeout(() => {
            this.elements.finalBox.classList.toggle('visible');
        }, 0);
    }

}



/**
 *
 * TODO 
 * Uwaga, JS function być może powinien przyjmować argument (event)
 * Zobaczyć doświadczenia z Mozillą (kalkulator albo zegarek)
 */
// document.addEventListener('DOMContentLoaded', function () {

// obliczenia ruchu komputera zawarto w computer

/**
 * Testy
 * 
 * Inicjacja zmiennych globalnych
 */
let game = new Game();
let computer = new Computer();

QUnit.module('static computer.getScore() method');
// 
QUnit.test('O is winning', function (assert) {
    game.board = [
        1, 2, 2,
        0, 0, 0,
        2, 2, 2
    ];
    game.current = 0;
    computer.minimax(game);
    assert.deepEqual(computer.minimax(game), 1, 'Wygrało kółko');
});
QUnit.test('static computer.getScore() method', function (assert) {
    game.board = [
        1, 2, 2,
        0, 1, 0,
        2, 2, 1
    ];
    game.current = 0;
    computer.minimax(game);
    assert.deepEqual(computer.minimax(game), -1, 'Wygrał krzyżyk');
});

QUnit.test('static computer.getScore() method', function (assert) {
    game.board = [
        1, 0, 1,
        0, 1, 0,
        1, 0, 1
    ];
    game.current = 0;
    computer.minimax(game);
    assert.deepEqual(computer.minimax(game), -1, 'Wygrał krzyżyk');
});

QUnit.test('Dalsza gra', function (assert) {
    game.board = [
        [2, 0, 1],
        [1, 1, 0],
        [0, 1, 1]
    ];
    assert.deepEqual(Computer.getScore(game), 0, 'Zwrócono 0');
});

QUnit.module('Dostępne ruchy - computer.getAvailableMoves()');

QUnit.test('tablica = [2, 2, 2, 2, 2, 2, 2, 2, 2]', function (assert) {
    // wszystkie wolne 
    game.board = [2, 2, 2, 2, 2, 2, 2, 2, 2];
    assert.deepEqual(computer.getAvailableMoves(game.board), [0, 1, 2, 3, 4, 5, 6, 7, 8],
        'dostępne ruchy z tablicy [0, 1, 2, 3, 4, 5, 6, 7, 8]');
});

QUnit.test('tablica = [1, 0, 1, 0, 2, 2, 2, 2, 2]', function (assert) {
    // wszystkie wolne 
    game.board = [1, 0, 1, 0, 2, 2, 2, 2, 2];
    assert.deepEqual(computer.getAvailableMoves(game.board), [4, 5, 6, 7, 8],
        'dostępne ruchy z tablicy [4, 5, 6, 7, 8]');
});

QUnit.module('minimax algoritm');

QUnit.test('Move for computer X', function (assert) {
    game.board = [0, 1, 0, 1, 0, 0, 1, 2, 2];
    game.computer = 1;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.deepEqual(computer.choice, 8, 'computer chooses right bottom corner (8)');
});

QUnit.test('Computer X blocks winning for O', function (assert) {
    game.board = [1, 2, 2, 0, 0, 2, 2, 2, 2];
    game.current = 1;
    game.computer = 1;
    game.opponent = 0;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.deepEqual(computer.choice, 5, 'computer blocks winning by O');
});

QUnit.test('Computer X blocks winning for O', function (assert) {
    game.board = [1, 2, 0, 2, 0, 2, 2, 1, 2];
    game.computer = 1;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.deepEqual(computer.choice, 6, 'computer blocks winning by O');
});


QUnit.test('Computer 0 blocks winning for X', function (assert) {
    game.board = [2, 2, 2, 2, 1, 2, 0, 2, 2];
    game.current = 1;
    game.computer = 1;
    game.opponent = 0;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok((computer.choice === 0) || (computer.choice === 2) || computer.choice === 8, 'computer chooses corner');
});

QUnit.module('setting board field');

QUnit.test('computer.setMove()', function (assert) {
    // let boardFields = document.querySelectorAll('.board__field');
    // boardFields.forEach( (value) => value.addEventListener('click', game.setBoardField.bind(game), false));
    // game.current = 0;
    // game.player = 0;
    // $('[data-field="0"]').trigger('click');
    game.board = [1, 2, 0, 2, 0, 2, 2, 2, 2];
    game.computer = 1;
    game.activeTurn = 1;
    game.computerEngine.setMove (game);
    // Verify expected behavior
    assert.deepEqual(game.board[6], 1, 'player mouse click was set');
});

QUnit.test('player.setMove()', function (assert) {
    game.board = [2, 2, 2, 2, 2, 2, 2, 2, 2];
    game.computer = 1;
    game.activeTurn = 0;
    game.current = 0;
    game.player = 0;
    let boardFields = document.querySelectorAll('.board__field');
    boardFields.forEach( (value) => value.addEventListener('click', game.setBoardField.bind(game, 'player'), false));
    $('[data-field="0"]').trigger('click');
    // game.computerEngine.setMove (game);
    // Verify expected behavior
    assert.deepEqual(game.board[0], 0, 'player mouse click was set');
});

QUnit.test('computer.setFirstMove();', function (assert) {
    let index = computer.setFirstMove();
    assert.ok(((index === 0 || index === 2 || index === 6 || index === 8 )), 'Wyznaczono pierwszy ruch');
});

