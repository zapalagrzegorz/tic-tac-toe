// @ts-check

// dalszy workflow gry:
// masa refaktoru w kodzie: najpierw własne, a potem wg Elii
// options: koloryzowanie znaków, które wygrały


/**
 *
 * TODO 
 * Uwaga, JS function być może powinien przyjmować argument (event)
 * Zobaczyć doświadczenia z Mozillą (kalkulator albo zegarek)
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // obliczenia ruchu komputera zawarto w computer
    let computer = new Computer;

    // globalna zmienna przechowujaca ustawienia gry
    // przerobić jako Class
    let gameReal = {
        player: 0,
        computer: 0,
        current: 0,
        opponent: 1,
        activeTurn: 0,
        board: [
            [2, 2, 2],
            [2, 2, 2],
            [2, 2, 2]
        ],
        result: 0,
        elements: {
            // @type Element
            finalBox: document.querySelector('#finalBox'),
            modalBox: document.body.querySelector('.modal'),
            initTextBox: document.querySelector('#initBox'),
            finalBox__result: document.querySelector('#finalBox__result'),
            finalBox__tryAgain: document.querySelector('#finalBox__tryAgain'),
            // znak do wyboru przez gracza
            playerCircle: document.querySelector('#playerCircle'),
            playerCross: document.querySelector('#playerCross'),
            boardFields: document.querySelectorAll('.board__field')
            
        },

        /**
         * ustawia wartość gracza oraz komputera 
         * @param {number} choice
         */
        setPlayer: function (choice) {
            this.player = choice;
            this.computer = (this.player === 1) ? 0 : 1;
            
            this.animateInitBox();
            if (this.player === 1) {
                this.current = this.computer;
                this.opponent = this.player;
                gameReal.setBoardField(computer.setFirstMove());
            }
        },

        /**
         * ustawia pole wartością komputera
         * @param {(object | number[])} data 
         */
        setBoardField: function (data) {
            let _this = this;
            let result;
            let boardField;
            
            /**
             * Sprawdza czy wybrane pole przez użytkownika jest prawidłowe
             * @param {object} boardField obiekt-właściwość 'target' z MouseEvent, którego źródłem jest click
             * @returns {boolean}
             */
            function isPlayerValidChoice (boardField) {
                if (boardField.dataset.field !== undefined && _this.board[boardField.dataset.field[0]][boardField.dataset.field[1]] === 2) {
                    return true;
                }
                return false;
            }
           
            if (Array.isArray(data)) {
            // computer

                this.board[data[0]][data[1]] = this.current;
                boardField = document.querySelector('[data-field="' + data[0] + data[1] + '"]');

                if (this.current) {
                    boardField.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
                } else {
                    boardField.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
                }
                result = Computer.getScore(gameReal);
                if (result !== undefined) {
                    this.prepareFinalBox(result);
                }
                this.current = this.player;
                this.activeTurn = this.current;
                this.opponent = this.computer;
            } else {
                // player
                boardField = data.target;
                let row;
                let column;
                
                if (isPlayerValidChoice(boardField)) {
                    row = boardField.dataset.field[0];
                    column = boardField.dataset.field[0];
                    this.board[row][column] = this.current;
                    if (this.player === 0) {
                        boardField.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
                    } else {
                        boardField.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
                    }

                    // TODO wyciagnąć jako funkcję, jeśli racjonalne
                    result = Computer.getScore(gameReal);
                    if (result === undefined) {
                        // computer.move(gameReal)
                        this.current = this.computer;
                        this.opponent = this.player;
                        this.activeTurn = this.current;
                        computer.minimax(gameReal);
                        gameReal.setBoardField(computer.choice);
                    } else {
                        // FIXME funkcja końcowa
                        this.prepareFinalBox(result);
                    }
                }
                
            }
        },
        /**
         * wywołuje animację dla inicjalnego dialogu
         */
        animateInitBox: function () {
            this.elements.initTextBox.classList.toggle('visible');
            // chowanie modalu po animacji
            setTimeout(() => this.elements.modalBox.style.display = 'none', 1500);
        },

        /**
         * TODO już czuć elementy wspólne
         * wywołuje animację dla inicjalnego dialogu
         * @param {number} time - czas do uruchomienia końcowej animacji 
         */
        animateFinalBox: function (time) {
            this.elements.modalBox.style.display = 'block';
            // gameReal.elements.finalBox.style.transform = 'rotateY(89deg)';
            setTimeout( function () {
                gameReal.elements.finalBox.classList.toggle('visible');
            }, time);
        },
        
        /**
         * 
         * @param {number} result 
         */
        prepareFinalBox: function (result) {
            const winner = result ? 'computer wins' : 'draw';
            this.elements.finalBox__result.textContent = winner;
            this.animateFinalBox();
        }
    };


    function replay () {
        gameReal.board = [
            [2, 2, 2],
            [2, 2, 2],
            [2, 2, 2]
        ];
        gameReal.player = 0;
        gameReal.opponent = 0;
        gameReal.current = 0;
        gameReal.result = 0;
        gameReal.elements.boardFields.forEach((value)=> {
            value.innerHTML = '';
        });

        gameReal.elements.finalBox.classList.toggle('visible');
        setTimeout( () =>  gameReal.elements.initTextBox.classList.toggle('visible'), 1500 );

    }

    
    /**
     *  inicjalizacja gry
     */
    (() => {
        gameReal.elements.modalBox.style.display = 'initial';

        gameReal.elements.initTextBox.classList.toggle('visible');

        /**
         * addeventListener podpina samą funkcję, bez obiektu, który posiada daną metodę, wskaźnik 'this' jest wówczas ustawiony na dany element, tu np. playerCircle. 
         * Metoda 'bind': pierwszym argument ustawia wskaźnik 'this' w wywołaniu metody setPlayer
         * drugi parametr przekazuje argument dla metody setPlayer 
         */
        gameReal.elements.playerCircle.addEventListener('click', gameReal.setPlayer.bind(gameReal, 0), false);
        gameReal.elements.playerCross.addEventListener('click', gameReal.setPlayer.bind(gameReal, 1), false);

        // dla każego pola gry podpinamy dla eventu click metodę setPlayerField (ustawiajac this na obiekt gameReal)
        // gameReal.elements.boardFields.forEach((value) => value.addEventListener('click', gameReal.setPlayerField.bind(gameReal), false));
        gameReal.elements.boardFields.forEach((value) => value.addEventListener('click', gameReal.setBoardField.bind(gameReal), false));
        gameReal.elements.finalBox__tryAgain.addEventListener('click', replay);
    })();
});
