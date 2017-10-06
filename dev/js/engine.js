// @ts-check

// dalszy workflow gry: koloryzowanie znaków
// sprawdzenie zwycięscy - komunikat

/**
 *
 * FIXME 
 * Uwaga, JS function być może powinien przyjmować argument (event)
 * Zobaczyć doświadczenia z Mozillą (kalkulator albo zegarek)
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // obliczenia ruchu komputera zawarto w computer
    let computer = new Computer;

    /** 
     * Poniżej są elementy z bloku inicjacyjnego 
     * TODO sprawdzić, czy poniższe elementy można zawrzeć w namespace'ie gameReal
     * **/

    // blok okalający (zmienić na modal-wrapper)
    const modalBox = document.body.querySelector('.modal');

    // blok okalający wartości
    const initTextBox = document.querySelector('#initBox');

    const finalBox__result = document.querySelector('#finalBox__result');
    const finalBox__tryAgain = document.querySelector('#finalBox__tryAgain');

    // znak do wyboru przez gracza
    const playerCircle = document.querySelector('#playerCircle');
    const playerCross = document.querySelector('#playerCross');
    const boardFields = document.querySelectorAll('.board__field');

    // globalna zmienna przechowujaca ustawienia gry
    let gameReal = {
        player: 0,
        opponent: 0,
        current: 0,
        activeTurn: 0,
        notActive: 0,
        board: [
            [2, 1, 1],
            [2, 2, 0],
            [1, 2, 0]
        ],
        result: 0,
        elements: {
            // @type Element
            finalBox: document.querySelector('#finalBox')
        },

        /**
         * ustawia wartość gracza oraz komputera 
         * @param {number} choice
         */
        setPlayer: function (choice) {
            this.player = choice;
            this.opponent = (this.player) ? 0 : 1;
            this.activeTurn = 0;
            this.notActive = 1;
            
            this.animateInitBox();
            if (this.player === 1) {
                this.current = 0;
                this.opponent = 1;
                computer.minimax(gameReal);
                // nie powinien robić np. computer?
                // TODO a może setField(komputer/gracz, wartość computer.minimax(gameReal);
                // nie powinien robić np. computer?
                // TODO a może setField(komputer/gracz, wartość)
                gameReal.setComputerField(computer.choice);
                // pierwszy ruch komputera to środkowe pole
                // nie wiem czemu pierwsza kalkulacja trwa tak długo :(
                // TODO
                // gameReal.setComputerField([1, 1]);
            }
        },

        /**
         * zaznacza pole gracza na planszy
         * 
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
            if ( 2 ===  this.board[row][column]) {
                this.board[row][column] = this.current;
                if (this.current) {
                    playerField.innerHTML = '<svg class="board__icon board__icon--shapes"><use xlink:href="#shapes"/></svg>';
                } else {
                    playerField.innerHTML = '<svg class="board__icon board__icon--circle"><use xlink:href="#circle"/></svg>';
                }
                this.current = this.opponent;
                // TODO wyciagnąć jako funkcję, jeśli racjonalne
                result = Computer.setScore(gameReal);
                if (result === undefined) {
                    gameReal.current = gameReal.opponent;
                    computer.minimax(gameReal);
                    // nie powinien robić np. computer?
                    // TODO a może setField(komputer/gracz, wartość computer.minimax(gameReal);
                    // nie powinien robić np. computer?
                    // TODO a może setField(komputer/gracz, wartość)
                    gameReal.setComputerField(computer.choice);
                } else {
                    // FIXME funkcja końcowa
                    // finalBox__result
                    this.prepareFinalBox(result);
                }
            }
        },
        /**
         * ustawia pole wartością komputera
         * 
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
            initTextBox.classList.toggle('visible');
            // chowanie modalu po animacji
            setTimeout(() => modalBox.style.display = 'none', 1500);
        },
        /**
         * TODO już czuć elementy wspólne
         * wywołuje animację dla inicjalnego dialogu
         */
        animateFinalBox: function () {
            modalBox.style.display = 'block';
            // gameReal.elements.finalBox.style.transform = 'rotateY(89deg)';
            setTimeout( function () {
                gameReal.elements.finalBox.classList.toggle('visible');
            }, 4000);
        },
        /**
         * 
         * @param {number} result 
         */
        prepareFinalBox: function (result) {
            const winner = result ? 'computer wins' : 'draw';
            finalBox__result.textContent = winner;
            this.animateFinalBox();
        }
    };

    /**
     *  inicjalizacja gry
     */
    function init () {
        modalBox.style.display = 'initial';

        initTextBox.classList.toggle('visible');

        /**
         * addeventListener podpina samą funkcję, bez obiektu, który posiada daną metodę, wskaźnik 'this' jest wówczas ustawiony na dany element, tu np. playerCircle. 
         * Metoda 'bind': pierwszym argument ustawia wskaźnik 'this' w wywołaniu metody setPlayer
         * drugi parametr przekazuje argument dla metody setPlayer 
         */
        playerCircle.addEventListener('click', gameReal.setPlayer.bind(gameReal, 0), false);
        playerCross.addEventListener('click', gameReal.setPlayer.bind(gameReal, 1), false);

        // dla każego pola gry podpinamy dla eventu click metodę setPlayerField (ustawiajac this na obiekt gameReal)
        boardFields.forEach((value) => value.addEventListener('click', gameReal.setPlayerField.bind(gameReal), false));
        finalBox__tryAgain.addEventListener('click', replay);
    }
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
        boardFields.forEach((value)=> {
            value.innerHTML = '';
        });

        gameReal.elements.finalBox.classList.toggle('visible');
        setTimeout( () => modalBox.style.display = 'none', 1500 );
    }
    init();
});
