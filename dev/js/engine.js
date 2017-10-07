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
                gameReal.setComputerField(computer.setFirstMove());
            }
        },

        /**
         * zaznacza pole gracza na planszy
         * @param {object} event mouseEvent
         */
        setPlayerField: function (event) {
            let playerField = event.target;
            let result;
            let row;
            let column;

            // jeżeli zostało wybrane pole
            if (playerField.dataset.field !== undefined) {
                row = playerField.dataset.field[0];
                column = playerField.dataset.field[1];
            }
            // sprawdzam czy docelowe pole nie zostało zajęte
            // wartość dwa to umowna wartość wolnego pola
            if ( this.board[row][column] === 2) {
                this.board[row][column] = this.current;
                if (this.current) {
                    playerField.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
                } else {
                    playerField.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
                }
                
                // TODO wyciagnąć jako funkcję, jeśli racjonalne
                result = Computer.setScore(gameReal);
                if (result === undefined) {
                    this.current = this.computer;
                    this.opponent = this.player;
                    this.activeTurn = this.current;
                    computer.minimax(gameReal);
                    // nie powinien robić np. computer?
                    // TODO a może setField(komputer/gracz, wartość computer.minimax(gameReal);
                    // nie powinien robić np. computer?
                    // TODO a może setField(komputer/gracz, wartość)
                    gameReal.setComputerField(computer.choice);
                } else {
                    // FIXME funkcja końcowa
                    this.prepareFinalBox(result);
                }
            }
        },
        /**
         * ustawia pole wartością komputera
         * @param {number[]} arr 
         */
        setComputerField: function (arr) {
            this.board[arr[0]][arr[1]] = this.current;
            let computerField = document.querySelector('[data-field="' + arr[0] + arr[1] + '"]');
            let result = undefined;

            // FIXME to wyciągnąć poza nawias - określić elementy html'u właściwe dla danej osoby już 
            // np. przy inicjalizacji
            if (this.current) {
                computerField.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
            } else {
                computerField.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
            }
            result = Computer.setScore(gameReal);
            if (result !== undefined) {
                this.prepareFinalBox(result);
            }
            this.current = this.player;
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
        gameReal.elements.boardFields.forEach((value) => value.addEventListener('click', gameReal.setPlayerField.bind(gameReal), false));
        gameReal.elements.finalBox__tryAgain.addEventListener('click', replay);
    })();
});
