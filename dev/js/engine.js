// @ts-check

// dalszy workflow gry:
// refactor wg Elii
// options: koloryzowanie znaków, które wygrały


/**
 *
 * TODO 
 * Uwaga, JS function być może powinien przyjmować argument (event)
 * Zobaczyć doświadczenia z Mozillą (kalkulator albo zegarek)
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let game = new Game();


    /**
     *  inicjalizacja gry
     */
    (() => {
        
        // addeventListener podpina samą funkcję, bez obiektu, który posiada daną metodę, wskaźnik 'this' jest wówczas ustawiony na dany element, tu np. playerCircle. 
        // Metoda 'bind': pierwszym argument ustawia wskaźnik 'this' w wywołaniu metody, drugi parametr przekazuje argument dla metody setPlayer 
        game.elements.playerCircle.addEventListener('click', game.setPlayer.bind(game, 0), false);
        game.elements.playerCross.addEventListener('click', game.setPlayer.bind(game, 1), false);
        game.elements.boardFields.forEach((value) => value.addEventListener('click', game.setBoardField.bind(game), false));
        game.elements.finalBox__tryAgain.addEventListener('click', game.replay.bind(game), false);
        game.elements.modalBox.style.display = 'initial';
        game.elements.initTextBox.classList.toggle('visible');

    })();
});
