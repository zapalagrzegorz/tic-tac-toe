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

    let gameReal = new Game();
    

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
        gameReal.elements.boardFields.forEach((value) => {
            value.innerHTML = '';
        });

        gameReal.elements.finalBox.classList.toggle('visible');
        setTimeout(() => gameReal.elements.initTextBox.classList.toggle('visible'), 1500);

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
