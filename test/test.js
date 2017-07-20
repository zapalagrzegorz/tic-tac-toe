

//  board is 2d arr 



var game = {
    player: 1,
    opponent: 0,
    current: 1,
    board: [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 1]
    ]

};

function score (game) {
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
            if (game.board[i][j] == game.player) {
                successPlayerVertical++;
                if (successPlayerVertical == 3) {
                    console.log('successVertical');
                    return 1;
                }
            }
            if (game.board[j][i] == game.player) {
                successPlayerHorizontal++;
                if (successPlayerHorizontal == 3) {
                    console.log('successHorizontal');
                    return 1;
                }
            }
            if (game.board[i][j] == game.opponent) {
                successOpponentVertical++;
                if (successOpponentVertical == 3) {
                    console.log('successOpponentVertical');
                    return -1;
                }
            } 
            if (game.board[j][i] == game.opponent) {
                successOpponentHorizontal++;
                if (successOpponentHorizontal == 3) {
                    console.log('successOpponentHorizontal');
                    return -1;
                }
            }
        }
        // clear after each row/column
        successPlayerVertical = successPlayerHorizontal = 0;
        successOpponentVertical = successOpponentHorizontal = 0;
    }

    // diagonal forward
    for (let i = 0; i < 3; i++) {
        if (game.board[i][i] == game.player) {
            successPlayerDiagonal++;
            if (successPlayerDiagonal == 3) {
                console.log('successPlayerDiagonal');
                return 1;
            }
        }
        if (game.board[i][i] == game.opponent) {
            successOpponentDiagonal++;
            if (successOpponentDiagonal == 3) {
                console.log('successOpponentDiagonal');
                return -1;
            }
        }
    }
    // diagonal backward
    for (let i = 2, j=0; i >= 0; i--, j++) {
        if (game.board[i][j] == game.player) {
            successPlayerDiagonalRev++;
            if (successPlayerDiagonalRev == 3) {
                console.log('successPlayerDiagonalBackward');
                return 1;
            }
        } else if (game.board[i][j] == game.opponent) {
            successOpponentDiagonalRev++;
            if (successOpponentDiagonalRev == 3) {
                console.log('successOpponentDiagonalRev');
                return -1;
            }
        }
    }
}


QUnit.test('Sprawdzanie warunku końca gry - sama funkcja', function (assert) {
    game.board =  [[1, 2, 2], [1, 2, 2], [1, 2, 2]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[1, 2, 2], [1, 2, 2], [1, 2, 2]]');
    
    game.board =  [[2, 1, 2], [2, 1, 2], [2, 1, 2]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[2, 1, 2], [2, 1, 2], [2, 1, 2]]');

    game.board =  [[0, 2, 1], [2, 2, 1], [2, 1, 1]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk poziomo; tablica = [[0, 2, 1], [2, 2, 1], [2, 1, 1]]');
    
    game.board =  [[1, 1, 1], [2, 2, 2], [2, 2, 2]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[1, 1, 1], [2, 2, 2], [2, 2, 2]]');
    
    game.board =  [[2, 2, 2], [1, 1, 1], [2, 2, 2]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[2, 2, 2], [1, 1, 1], [2, 2, 2]]');
    
    game.board =  [[2, 2, 2], [2, 2, 2], [1, 1, 1]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[2, 2, 2], [2, 2, 2], [1, 1, 1]]');
   
    // kółko
    game.board =  [[0, 0, 0], [2, 2, 2], [2, 2, 2]];
    assert.deepEqual( score(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[0, 0, 0], [2, 2, 2], [2, 2, 2]]');
    
    game.board =  [[2, 2, 2], [0, 0, 0], [2, 2, 2]];
    assert.deepEqual( score(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[2, 2, 2], [0, 0, 0], [2, 2, 2]]');
    
    game.board =  [[2, 2, 2], [2, 2, 2], [0, 0, 0]];
    assert.deepEqual( score(game), -1, 'Koniec gry, wygrywa kółko pionowo; tablica = [[2, 2, 2], [2, 2, 2], [0, 0, 0]]');
    
    game.board =  [[0, 2, 2], [0, 2, 2], [0, 2, 2]];
    assert.deepEqual( score(game), -1, 'Koniec gry, wygrywa kółko poziomo; tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
      
    game.board = [[2, 0, 2], [2, 0, 2], [2, 0, 2]];
    assert.deepEqual( score(game), -1, 'Koniec gry: wygrywa kółko poziomo; tablica = [[2, 0, 2], [2, 0, 2], [2, 0, 2]]');
  
    game.board = [[2, 2, 0], [2, 2, 0], [2, 2, 0]];
    assert.deepEqual( score(game), -1, 'Koniec gry: wygrywa kółko poziomo; tablica = [[2, 2, 0], [2, 2, 0], [2, 2, 0]]');

    // skosy
    game.board = [[1, 2, 2], [2, 1, 2], [2, 2, 1]];
    assert.equal( score(game), 1, 'Koniec gry: wygrywa krzyżyk po skosie = [[1, 2, 2], [2, 1, 2], [2, 2, 1]]');

    game.board = [[2, 2, 1], [2, 1, 2], [1, 2, 2]];
    assert.equal( score(game), 1, 'Koniec gry: wygrywa krzyżyk po skosie do tyłu = [[2, 2, 1], [2, 1, 2], [1, 2, 2]]');
    
    game.board = [[0, 2, 2], [2, 0, 2], [2, 2, 0]];
    assert.equal( score(game), -1, 'Koniec gry: wygrywa kółko po skosie = [[0, 2, 2], [2, 0, 2], [2, 2, 0]]');

    game.board = [[2, 2, 0], [2, 0, 2], [0, 2, 2]];
    assert.equal( score(game), -1, 'Koniec gry: wygrywa kółko po skosie do tyłu = [[2, 2, 0], [2, 0, 2], [0, 2, 2]]');

    game.board = [[0, 0, 1], [1, 1, 0], [0, 1, 1]];
    assert.equal( score(game), undefined, 'Dalsza gra tablica = [[0, 0, 1], [1, 1, 0], [0, 1, 1]]');


});
