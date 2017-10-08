// @ts-check



/**
 * @class Computer
 */
class Computer {
    constructor () {
        // kluczowa tablica przechowująca 'najlepszy' ruch
        this.choice = [];
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
     * TODO 
     * obliczanie wartości gry nie ma logicznego związku umieszczenie w klasie gracz-komputer
     * ewidentnie należy do mechanizmu 'centralnego'
     *
     * @param {object} game 
     * @return {number} The x value.
     */
    static setScore (game) {
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
        let score = Computer.setScore(game);
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
     * Gets first move for computer
     * @return {number[]} pseudo-random first choice of computer
     *   minimax on empty table always generates place [0,0] as the best choice, but it takes around 5 secs
     *  to avoid that, generate pseudo-random move which is equivalent to that
     */
    setFirstMove () {
        let possibleMoves = [
            [0, 0],
            [0, 2],
            [2, 0],
            [2, 2]
        ];
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
        
        // TODO sprawdzić co się dzieje w minimaxie z activeTurn
        game.activeTurn = game.current;
        this.minimax(game);
        const boardField = document.querySelector('[data-field="' + this.choice[0] + this.choice[1] + '"]');
        game.setBoardField(boardField);
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


// globalna zmienna przechowujaca ustawienia gry
let game = {
    player: 0,
    computer: 0,
    current: 0,
    opponent: 1,
    activeTurn: 0,
    notActive: 0,
    board: [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2]
    ],
    result: 0,

     
    /**
         * Określa pole gracza na planszy 
         * @param {object} data HTMLelement
         */
    setBoardField: function (data) {
        let _this = this;
        let boardField;
        let result;
        let row;
        let column;
           
        /**
             * Sprawdza czy ruch gracza jest prawidłowy
             * @param {object} chosenField to jest object, property MouseEvent.target pochodzący z event'u 'click' Player'a
             * @return {boolean}
             */
        function isPlayerValidMove (chosenField) {

            // czy zostało wybrane pole gry i czy jest nadal wolne
            if (chosenField.field !== undefined && _this.board[chosenField.field[0]][chosenField.field[1]] === 2) {
                row = chosenField.field[0];
                column = chosenField.field[1];
                return true;
            }
        }
           
        /**
             * Zaznacza wybrane pole w DOM
             * @param {object} field HTMLelement 
             */
        function setBoardFieldDOM (field) {
            if (_this.current === 1) {
                field.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
            } else {
                field.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
            }
        } 
    
        if (data.target === undefined) {

            // computer
            row = data.dataset.field[0];
            column = data.dataset.field[1];

            // zaznaczenie na planszy wewnętrznej
            this.board[row][column] = this.current;

            // zaznaczenie na planszy DOM
            setBoardFieldDOM (data);
            result = Computer.getScore(game); 
            if (result !== undefined) {
                this.prepareFinalBox(result);
            }
            this.current = this.player;
        } else {

            // player
            boardField = data.target;
        
            if (isPlayerValidMove(boardField.dataset)) {

                this.board[row][column] = this.current;
                setBoardFieldDOM (boardField);
                    
                result = Computer.setScore(game);
                if (result !== undefined) {
                    this.prepareFinalBox(result);
                } else {
                    computer.setMove(game);
                }
            }
        }
    },
};

/**
 * Testy
 * 
 * Inicjacja zmiennych globalnych
 */
let computer = new Computer;
game.current = 1;
game.opponent = 0;

// this test fails when located next to minimax assertions and run with all tests
QUnit.test('Computer blocks winning for O', function (assert) {
    game.board = [
        [1, 2, 2],
        [0, 0, 2],
        [2, 2, 2]
    ];
    game.current = 1;
    game.computer = 1;
    game.opponent = 0;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok( (computer.choice[0] === 1 && computer.choice[1] === 2), 'computer chooses [1,2]');
});

QUnit.module('wygrywa krzyżyk - setScore()');

QUnit.test('tablica = [[1, 2, 2], [1, 2, 2], [1, 2, 2]]', function (assert) {
    game.board = [
        [1, 2, 2],
        [1, 2, 2],
        [1, 2, 2]
    ];
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[1, 2, 2], [1, 2, 2], [1, 2, 2]]');
});

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [2, 1, 2],
        [2, 1, 2],
        [2, 1, 2]
    ];
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]');
});

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [0, 2, 1],
        [2, 2, 1],
        [2, 1, 1]
    ];
    game.current = 1;
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[0, 2, 1], [2, 2, 1], [2, 1, 1]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [1, 1, 1],
        [2, 2, 2],
        [2, 2, 2]
    ];
    game.current = 1;
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[1, 1, 1], [2, 2, 2], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [2, 2, 2],
        [1, 1, 1],
        [2, 2, 2]
    ];
    game.current = 1;
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[2, 2, 2], [1, 1, 1], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [2, 2, 2],
        [2, 2, 2],
        [1, 1, 1]
    ];
    game.current = 1;
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[2, 2, 2], [2, 2, 2], [1, 1, 1]]');
});

QUnit.module('Wygrywa kółko - setScore()');
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [0, 0, 0],
        [2, 2, 2],
        [2, 2, 2]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[0, 0, 0], [2, 2, 2], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [2, 2, 2],
        [0, 0, 0],
        [2, 2, 2]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[2, 2, 2], [0, 0, 0], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 2, 2], [2, 2, 2], [0, 0, 0]]', function (assert) {
    game.board = [
        [2, 2, 2],
        [2, 2, 2],
        [0, 0, 0]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[2, 2, 2], [2, 2, 2], [0, 0, 0]]');
});
QUnit.test('tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]', function (assert) {
    game.board = [
        [0, 2, 2],
        [0, 2, 2],
        [0, 2, 2]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry, wygrywa kółko poziomo; tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
});
QUnit.test('tablica = [[2, 0, 2], [2, 0, 2], [2, 0, 2]]', function (assert) {
    game.board = [
        [2, 0, 2],
        [2, 0, 2],
        [2, 0, 2]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry: wygrywa kółko poziomo; tablica = [[2, 0, 2], [2, 0, 2], [2, 0, 2]]');
});
QUnit.test('tablica = [[2, 2, 0], [2, 2, 0], [2, 2, 0]]', function (assert) {
    game.board = [
        [2, 2, 0],
        [2, 2, 0],
        [2, 2, 0]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry: wygrywa kółko poziomo; tablica = [[2, 2, 0], [2, 2, 0], [2, 2, 0]]');
});
QUnit.test('tablica = [[1, 2, 2], [2, 1, 2], [2, 2, 1]]', function (assert) {

    game.board = [
        [1, 2, 2],
        [2, 1, 2],
        [2, 2, 1]
    ];
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry: wygrywa krzyżyk po skosie = [[1, 2, 2], [2, 1, 2], [2, 2, 1]]');
});
QUnit.test('tablica = [[2, 2, 1], [2, 1, 2], [1, 2, 2]]', function (assert) {
    game.board = [
        [2, 2, 1],
        [2, 1, 2],
        [1, 2, 2]
    ];
    assert.deepEqual(Computer.setScore(game), 1, 'Koniec gry: wygrywa krzyżyk po skosie do tyłu = [[2, 2, 1], [2, 1, 2], [1, 2, 2]]');
});
QUnit.test('tablica = [[0, 2, 2], [2, 0, 2], [2, 2, 0]]', function (assert) {
    game.board = [
        [0, 2, 2],
        [2, 0, 2],
        [2, 2, 0]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry: wygrywa kółko po skosie = [[0, 2, 2], [2, 0, 2], [2, 2, 0]]');
});
QUnit.test('tablica = [[2, 2, 0], [2, 0, 2], [0, 2, 2]]', function (assert) {
    game.board = [
        [2, 2, 0],
        [2, 0, 2],
        [0, 2, 2]
    ];
    assert.deepEqual(Computer.setScore(game), -1, 'Koniec gry: wygrywa kółko po skosie do tyłu = [[2, 2, 0], [2, 0, 2], [0, 2, 2]]');
});
QUnit.module('Remis - setScore()');
QUnit.test('tablica = [[0, 0, 1], [1, 1, 0], [0, 1, 1]]', function (assert) {
    game.board = [
        [0, 0, 1],
        [1, 1, 0],
        [0, 1, 1]
    ];
    assert.deepEqual(Computer.setScore(game), 0, 'Remis, koniec gry; tablica = [[0, 0, 1], [1, 1, 0], [0, 1, 1]]');
});
QUnit.test('tablica = [[0, 1, 0], [1, 0, 0], [1, 0, 1]]', function (assert) {
    game.board = [
        [0, 1, 0],
        [1, 0, 0],
        [1, 0, 1]
    ];
    assert.deepEqual(Computer.setScore(game), 0, 'Remis, koniec gry; tablica = [[0, 1, 0], [1, 0, 0], [1, 0, 1]]');
});

QUnit.module('Dalsza gra - setScore()');

QUnit.test('tablica = [[2, 0, 1], [1, 1, 0], [0, 1, 1]]', function (assert) {
    game.board = [
        [2, 0, 1],
        [1, 1, 0],
        [0, 1, 1]
    ];
    assert.deepEqual(Computer.setScore(game), undefined, 'Dalsza gra tablica = [[2, 0, 1], [1, 1, 0], [0, 1, 1]]');
});


QUnit.module('Dostępne ruchy - computer.getAvailableMoves()');


game.board = [
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 2]
];
console.log(computer.getAvailableMoves(game));

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2]
    ];
    assert.deepEqual(computer.getAvailableMoves(game), [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2]
    ], 'dostępne ruchy z tablicy [[0, 2, 0],[1, 2, 1],[1, 0, 2]] to 0,1, 1,1, 2,2');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [0, 2, 0],
        [1, 2, 1],
        [1, 0, 2]
    ];
    assert.deepEqual(computer.getAvailableMoves(game), [
        [0, 1],
        [1, 1],
        [2, 2]
    ], 'dostępne ruchy z tablicy [[0, 2, 0],[1, 2, 1],[1, 0, 2]] to 0,1, 1,1, 2,2');
});

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [
        [0, 2, 2],
        [2, 2, 1],
        [0, 0, 1]
    ];
    assert.deepEqual(computer.getAvailableMoves(game), [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1]
    ], 'dostępne ruchy z tablicy [[0, 2, 2], [2, 2, 1], [0, 0, 1]] to [0,1],[0,2],[1,0],[1,1]');
});

QUnit.module('computer methods');

QUnit.test('pseudo-losowy pierwszy ruch', function (assert) {
    let arr = computer.setFirstMove();
    assert.ok(((arr[0] === 0 || arr[0] === 2) && (arr[1] === 0 || arr[1] === 2)), 'Wyznaczono pierwszy ruch');
});

QUnit.module('setting board field');
QUnit.test('setting board field', function (assert) {
    let boardFields = document.querySelectorAll('.board__field');
    boardFields.forEach((value) => value.addEventListener('click', game.setBoardField.bind(game), false));
    game.current = 0;
    game.player = 0;
    $('[data-field="00"]').trigger('click');
    // Verify expected behavior
    assert.deepEqual(game.board[0][0], 0, 'player mouse click was set');
});

QUnit.module('minimax algoritm');

QUnit.test('Second move for computer X if O choose center', function (assert) {
    game.board = [
        [2, 2, 2],
        [2, 0, 2],
        [2, 2, 2]
    ];
    game.computer = 1;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok( (computer.choice[0] === 0 && computer.choice[1] === 0), 'computer chooses [0,0]');
});

QUnit.test('Computer X blocks winning for O', function (assert) {
    game.board = [
        [1, 2, 0],
        [0, 0, 1],
        [2, 2, 2]
    ];
    game.computer = 1;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok( (computer.choice[0] === 2 && computer.choice[1] === 0), 'computer chooses [2,0]');
});

QUnit.test('Computer X blocks winning for O', function (assert) {
    game.board = [
        [1, 2, 2],
        [0, 0, 2],
        [2, 2, 2]
    ];
    game.current = 1;
    game.computer = 1;
    game.opponent = 0;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok( (computer.choice[0] === 1 && computer.choice[1] === 2), 'computer chooses [1,2]');
});

QUnit.test('Computer X blocks winning for O', function (assert) {
    game.board = [
        [1, 2, 0],
        [0, 0, 1],
        [2, 2, 2]
    ];
    game.current = 1;
    game.computer = 1;
    game.opponent = 0;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok( (computer.choice[0] === 2 && computer.choice[1] === 0), 'computer chooses [2,0]');
});

QUnit.test('Computer 0 blocks winning for X', function (assert) {
    game.board = [
        [2, 2, 2],
        [2, 1, 2],
        [0, 2, 2]
    ];
    game.current = 1;
    game.computer = 1;
    game.opponent = 0;
    game.activeTurn = 1;
    computer.minimax(game);
    assert.ok( (computer.choice[0] === 0 && computer.choice[1] === 0) || (computer.choice[0] === 0 && computer.choice[2] === 0), 'computer chooses [0,0]');
});

