// @ts-check

// dalszy workflow gry:
// ładowanie pierwszego wyboru pseudo-random dla komputera-kółko
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
        notActive: 0,
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
                // TODO a może setField(komputer/gracz, wartość computer.minimax(gameReal);
                gameReal.setBoardField(computer.setFirstMove());
            }
        },
        
        /**
         * Określa pole gracza na planszy 
         * @param {(object | number[])} data object to data
         */
        setBoardField: function (data) {
            let result;
            let boardField;
            let _this = this;
            /**
             * Sprawdza czy ruch gracza jest prawidłowy
             * @param {object} chosenField to jest object, property MouseEvent.target pochodzący z event'u 'click' Player'a
             * @return {boolean}
             */
            function isPlayerValidMove (chosenField) {
                // czy zostało wybrane pole gry i czy jest nadal wolne
                if (chosenField.dataset.field !== undefined && _this.board[boardField.dataset.field[0]][boardField.dataset.field[1]] === 2) {
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
            if (Array.isArray(data)) {

                // computer
                this.board[data[0]][data[1]] = this.current;
                let boardField = document.querySelector('[data-field="' + data[0] + data[1] + '"]');
    
                setBoardFieldDOM (boardField);
                result = Computer.setScore(gameReal);
                if (result !== undefined) {
                    this.prepareFinalBox(result);
                }
                this.current = this.player;
            } else {

                // player
                boardField = data.target;
                let row;
                let column;
        
                if (isPlayerValidMove(boardField)) {
                    row = boardField.dataset.field[0];
                    column = boardField.dataset.field[1];

                    this.board[row][column] = this.current;
                    setBoardFieldDOM (boardField);
        
                    // TODO wyciagnąć jako funkcję, jeśli racjonalne
                    result = Computer.setScore(gameReal);
                    if (result === undefined) {
                        computer.setMove(gameReal);
                        // this.current = this.computer;
                        // this.opponent = this.player;
                        
                        // // TODO sprawdzić co się dzieje w minimaxie z activeTurn
                        // this.activeTurn = this.current;
                        // computer.minimax(gameReal);
                        // gameReal.setBoardField(computer.choice);
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
