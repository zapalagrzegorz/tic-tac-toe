/**
 * główna logika gry
 * @class
 */
class Game {
    constructor () {
        this.player = 0;
        this.computer = 0;
        this.current = 0;
        this.opponent = 1;
        this.activeTurn = 0;
        this.notActive = 0;
        this.board = [
            [2, 2, 2],
            [2, 2, 2],
            [2, 2, 2]
        ];
        this.result = 0;
        this.elements = {

            finalBox: document.querySelector('#finalBox'),
            modalBox: document.body.querySelector('.modal'),
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
     * Określa pole gracza na planszy 
     * @param {object} data HTMLelement
     */
    setBoardField (data) {
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
            setBoardFieldDOM(data);
            result = Computer.getScore(this);
            if (result !== undefined) {
                this.prepareFinalBox(result);
            }
            this.current = this.player;
        } else {

            // player
            boardField = data.target;

            if (isPlayerValidMove(boardField.dataset)) {

                this.board[row][column] = this.current;
                setBoardFieldDOM(boardField);

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
            setTimeout( ()=> {
                this.setBoardField(this.computerEngine.setFirstMove());
            }, 2000);
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

        // zwykła funkcja tworzy scope w którym this jest undefined; arrow function przekazuje scope
        setTimeout(() => {
            this.elements.finalBox.classList.toggle('visible');
        }, 0);
    }
    replay () {
        this.board = [
            [2, 2, 2],
            [2, 2, 2],
            [2, 2, 2]
        ];
        this.player = 0;
        this.opponent = 0;
        this.current = 0;
        this.result = 0;
        this.elements.boardFields.forEach((value) => {
            value.innerHTML = '';
        });

        this.elements.finalBox.classList.toggle('visible');
        setTimeout(() => this.elements.initTextBox.classList.toggle('visible'), 1500);

    }
}
