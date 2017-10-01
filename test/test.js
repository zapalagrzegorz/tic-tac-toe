// @ts-check

// dalszy workflow gry: koloryzowanie znaków
// zaznaczanie znaku komputera 
// sprawdzenie zwycięscy - komunikat

//  board is 2d arr 
// var board = [[0, 2, 0], [1, 2, 1], [1, 0, 2]];
// let availMoves = get_available_moves(board).reduce(function (acc, curr) {
//     return acc.concat(curr);
// }, []);

// var myNewArray4 = [].concat(...get_available_moves(board));
// console.log(myNewArray4);
//  ... operator - used as spread operator
//  mdn example: 
// var parts = ['shoulders', 'knees']; 
// var lyrics = ['head', ...parts, 'and', 'toes']; 
// ["head", "shoulders", "knees", "and", "toes"]




/**
 * Event DOMContentLoaded jest tutaj (niedoskonałym) substytutem dla $(function() {}); albo dłuższa wersja
 * $( document ).ready(function() { // Handler for .ready() called. });
 *
 * Uwaga, JS function być może powinien przyjmować argument (event)
 */
document.addEventListener('DOMContentLoaded', function () {


    /**
   * TODO wyodrębnić do nowego pliku 
   * może exporcik :-)
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
         * Modyfikator static. Za MDN: Static method calls are made directly on the class and are not callable on instances of the class. Static methods are often used to create utility functions.
         * [czy to ma sens?! skoro klasę ]
         * 
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

            // check column and row
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (game.board[i][j] === game.player) {
                        successPlayerVertical++;
                        if (successPlayerVertical === 3) {
                            // console.log('successPlayerVertical');
                            return 1;
                        }
                    }
                    if (game.board[j][i] === game.player) {
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
                if (game.board[i][i] === game.player) {
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
                if (game.board[i][j] === game.player) {
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

        get_available_moves (game) {
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
         * Funkcja pomocnicza
         * Generuje nowy stan gry
         * @param {number[]} move 
         * @param {Object} game 
         */
        get_new_state (move, game) {
            // kopiowanie tworzy referencję
            // for(var prop in this){
            //     newGame[prop] = this[prop];
            // }
            // aby zrobić deep copy MDN rekomenduje parse i stringify obiektu JSON
            let newGame = JSON.parse(JSON.stringify(game));
            newGame.board[move[0]][move[1]] = newGame.current;
            // change player
            newGame.current = (newGame.current === 1) ? 0 : 1;
            return newGame;
        }
        /**
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
            this.get_available_moves(game).forEach(function iterateMoves (move) {

                let possibleGame = this.get_new_state(move, game);

                scores.push(this.minimax(possibleGame));

                moves.push(move);
            }, this);

            // Do the min or the max calculation
            // This is the max calculation
            // TODO - styl zmiennych i nazw funkcji
            // 
            if (game.current === game.player) {
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
    }

    // obliczenia ruchu komputera zawarto w computer
    let computer = new Computer;
    
    /** 
     * Poniżej są elementy z bloku inicjacyjnego 
     * TODO sprawdzić, czy poniższe elementy można zawrzeć w namespace'ie
     * **/

    // blok okalający (zmienić na modal-wrapper)
    const modalBox = document.body.querySelector('.modal');
    
    // blok okalający wartości
    const initTextBox = document.querySelector('#initBox');
    
    // znak do wyboru przez gracza
    const playerCircle = document.querySelector('#playerCircle');
    const playerCross = document.querySelector('#playerCross');
    const boardFields = document.querySelectorAll('.board__field');

    // globalna zmienna przechowujaca ustawienia gry
    let gameReal = {
        player: 0,
        opponent: 0,
        current: 0,
        board: [[2, 2, 2], [2, 2, 2], [2, 2, 2]],
        result: 0,

        /**
         * ustawia wartość gracza oraz komputera 
         * @param {number} choice 
         */
        setPlayer: function (choice) {
            this.player = choice;
            this.opponent = (this.player) ? 0 : 1;
            this.animateInitBox();
            if (this.player === 1) {

                // pierwszy ruch komputera to środkowe pole
                // nie wiem czemu pierwsza kalkulacja trwa tak długo :(
                // FIXME
                gameReal.setComputerField([1, 1]);
            }
        },
        /**
         * ustawia pole wartością gracza
         * 
         */
        setPlayerField: function (event) {
            let playerField = event.target;
            let result;

            if (playerField.dataset.field !== undefined) {
                this.board[playerField.dataset.field[0]][playerField.dataset.field[1]] = this.player;
                if (this.player) {
                    playerField.innerHTML = '<svg class="icon icon-shapes"><use xlink:href="#shapes"/></svg>';
                } else {
                    playerField.innerHTML = '<svg class="icon"><use xlink:href="#circle"/></svg>';
                }
            }
            // FIXME wyciagnąć jako funckję
            result = Computer.setScore(gameReal);
            if (result === undefined) {
                computer.minimax(gameReal);
                gameReal.setComputerField(computer.choice);
            } else {
                console.log(result);
            }

        },
        /**
         * ustawia pole wartością komputera
         * 
         */
        setComputerField: function (arr) {
            this.board[ arr[0] ] [ arr[1] ] = this.opponent;
            let computerField = document.querySelector('[data-field="'+ arr[0] + arr[1]+'"]');
            let result = undefined;
            // FIXME to wyciągnąć poza nawias - określić elementy html'u właściwe dla danej osoby już 
            // np. przy inicjalizacji
            if (this.opponent) {
                computerField.innerHTML = '<svg class="icon icon-shapes"><use xlink:href="#shapes"/></svg>';
            } else {
                computerField.innerHTML = '<svg class="icon"><use xlink:href="#circle"/></svg>';
            }
            result = Computer.setScore(gameReal);
            if (result !== undefined) {
                console.log(result);
            }        
        },
        /**
         * wywołuje animację dla inicjalnego dialogu
         */
        animateInitBox: function () {
            initTextBox.classList.toggle('example');
            // chowanie modalu po animacji
            setTimeout(() => modalBox.style.display = 'none', 1500);
        }
    };
    
    /**
     *  inicjalizacja gry
     */
    function init () {
        modalBox.style.display = 'initial';
        gameReal.board = [[2, 2, 2], [2, 2, 2], [2, 2, 2]];

        initTextBox.classList.toggle('example');

        /**
        * addeventListener podpina samą funkcję, bez obiektu, który posiada daną metodę, wskaźnik 'this' jest wówczas ustawiony na dany element, tu np. playerCircle. 
        * Metoda 'bind': pierwszym argument ustawia wskaźnik 'this' w wywołaniu metody setPlayer
        * drugi parametr przekazuje argument dla metody setPlayer 
        */
        playerCircle.addEventListener('click', gameReal.setPlayer.bind(gameReal, 0), false);
        playerCross.addEventListener('click', gameReal.setPlayer.bind(gameReal, 1), false);

        // dla każego pola gry podpinamy dla eventu click metodę setPlayerField (ustawiajac this na obiekt gameReal)
        boardFields.forEach((value) => value.addEventListener('click', gameReal.setPlayerField.bind(gameReal), false));
    }

    init();



});




// let scoreGameTemp = minimax(game);
// console.log(score);
// console.log(get_available_moves(game.board));

/* 
QUnit.module("wygrywa krzyżyk - setScore()");
QUnit.test('tablica = [[1, 2, 2], [1, 2, 2], [1, 2, 2]]', function (assert) {
    game.board = [[1, 2, 2], [1, 2, 2], [1, 2, 2]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[1, 2, 2], [1, 2, 2], [1, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[2, 1, 2], [2, 1, 2], [2, 1, 2]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]');
});

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[0, 2, 1], [2, 2, 1], [2, 1, 1]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[0, 2, 1], [2, 2, 1], [2, 1, 1]]');
})
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[1, 1, 1], [2, 2, 2], [2, 2, 2]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[1, 1, 1], [2, 2, 2], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[2, 2, 2], [1, 1, 1], [2, 2, 2]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[2, 2, 2], [1, 1, 1], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[2, 2, 2], [2, 2, 2], [1, 1, 1]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[2, 2, 2], [2, 2, 2], [1, 1, 1]]');
});

QUnit.module("Wygrywa kółko - setScore()");
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    // kółko
    game.board = [[0, 0, 0], [2, 2, 2], [2, 2, 2]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[0, 0, 0], [2, 2, 2], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[2, 2, 2], [0, 0, 0], [2, 2, 2]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[2, 2, 2], [0, 0, 0], [2, 2, 2]]');
});
QUnit.test('tablica = [[2, 2, 2], [2, 2, 2], [0, 0, 0]]', function (assert) {
    game.board = [[2, 2, 2], [2, 2, 2], [0, 0, 0]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[2, 2, 2], [2, 2, 2], [0, 0, 0]]');
});
QUnit.test('tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]', function (assert) {
    game.board = [[0, 2, 2], [0, 2, 2], [0, 2, 2]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry, wygrywa kółko poziomo; tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
});
QUnit.test('tablica = [[2, 0, 2], [2, 0, 2], [2, 0, 2]]', function (assert) {
    game.board = [[2, 0, 2], [2, 0, 2], [2, 0, 2]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry: wygrywa kółko poziomo; tablica = [[2, 0, 2], [2, 0, 2], [2, 0, 2]]');
});
QUnit.test('tablica = [[2, 2, 0], [2, 2, 0], [2, 2, 0]]', function (assert) {
    game.board = [[2, 2, 0], [2, 2, 0], [2, 2, 0]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry: wygrywa kółko poziomo; tablica = [[2, 2, 0], [2, 2, 0], [2, 2, 0]]');
});
QUnit.test('tablica = [[1, 2, 2], [2, 1, 2], [2, 2, 1]]', function (assert) {
    // skosy
    game.board = [[1, 2, 2], [2, 1, 2], [2, 2, 1]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry: wygrywa krzyżyk po skosie = [[1, 2, 2], [2, 1, 2], [2, 2, 1]]');
});
QUnit.test('tablica = [[2, 2, 1], [2, 1, 2], [1, 2, 2]]', function (assert) {
    game.board = [[2, 2, 1], [2, 1, 2], [1, 2, 2]];
    assert.deepEqual(setScore(game), 1, 'Koniec gry: wygrywa krzyżyk po skosie do tyłu = [[2, 2, 1], [2, 1, 2], [1, 2, 2]]');
});
QUnit.test('tablica = [[0, 2, 2], [2, 0, 2], [2, 2, 0]]', function (assert) {
    game.board = [[0, 2, 2], [2, 0, 2], [2, 2, 0]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry: wygrywa kółko po skosie = [[0, 2, 2], [2, 0, 2], [2, 2, 0]]');
});
QUnit.test('tablica = [[2, 2, 0], [2, 0, 2], [0, 2, 2]]', function (assert) {
    game.board = [[2, 2, 0], [2, 0, 2], [0, 2, 2]];
    assert.deepEqual(setScore(game), -1, 'Koniec gry: wygrywa kółko po skosie do tyłu = [[2, 2, 0], [2, 0, 2], [0, 2, 2]]');
});
QUnit.module("Remis - setScore()");
QUnit.test('tablica = [[0, 0, 1], [1, 1, 0], [0, 1, 1]]', function (assert) {
    game.board = [[0, 0, 1], [1, 1, 0], [0, 1, 1]];
    assert.deepEqual(setScore(game), 0, 'Remis, koniec gry; tablica = [[0, 0, 1], [1, 1, 0], [0, 1, 1]]');
});
QUnit.test('tablica = [[0, 1, 0], [1, 0, 0], [1, 0, 1]]', function (assert) {
    game.board = [[0, 1, 0], [1, 0, 0], [1, 0, 1]];
    assert.deepEqual(setScore(game), 0, 'Remis, koniec gry; tablica = [[0, 1, 0], [1, 0, 0], [1, 0, 1]]');
});

QUnit.module("Dalsza gra - setScore()");

QUnit.test('tablica = [[2, 0, 1], [1, 1, 0], [0, 1, 1]]', function (assert) {
    game.board = [[2, 0, 1], [1, 1, 0], [0, 1, 1]];
    assert.deepEqual(setScore(game), undefined, 'Dalsza gra tablica = [[2, 0, 1], [1, 1, 0], [0, 1, 1]]');
});

QUnit.module("Dostępne ruchy - get_available_moves()");

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[2, 2, 2], [2, 2, 2], [2, 2, 2]];
    assert.deepEqual(get_available_moves(game.board), [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]], 'dostępne ruchy z tablicy [[0, 2, 0],[1, 2, 1],[1, 0, 2]] to 0,1, 1,1, 2,2');
});
QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[0, 2, 0], [1, 2, 1], [1, 0, 2]];
    assert.deepEqual(get_available_moves(game.board), [[0, 1], [1, 1], [2, 2]], 'dostępne ruchy z tablicy [[0, 2, 0],[1, 2, 1],[1, 0, 2]] to 0,1, 1,1, 2,2');
});

QUnit.test('tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]', function (assert) {
    game.board = [[0, 2, 2], [2, 2, 1], [0, 0, 1]];
    assert.deepEqual(get_available_moves(game.board), [[0,1],[0,2],[1,0],[1,1]], 'dostępne ruchy z tablicy [[0, 2, 2], [2, 2, 1], [0, 0, 1]] to [0,1],[0,2],[1,0],[1,1]');
});

*/