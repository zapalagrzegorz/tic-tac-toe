

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
            } else if (game.board[j][i] == game.player) {
                successPlayerHorizontal++;
                if (successPlayerHorizontal == 3) {
                    console.log('successHorizontal');
                    return 1;
                }
            } else if (game.board[i][j] == game.opponent) {
                successOpponentVertical++;
                if (successOpponentVertical == 3) {
                    console.log('successVertical');
                    return -1;
                }
            } else if (game.board[j][i] == game.opponent) {
                successOpponentHorizontal++;
                if (successOpponentHorizontal == 3) {
                    console.log('successHorizontal');
                    return 1;
                }
            }
        }
        // clear after each row/column
        successPlayerVertical = successPlayerHorizontal = 0;
        successOpponentVertical = successOpponentHorizontal = 0;
    }

    // diagonal forward
    for (let i = 0; i < 3; i++) {
        if (game.board[i][i] == game.opponent) {
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
                return 1;
            }
        }
    }
    // diagonal backward
    for (let i = 2; i >= 0; i--) {
        if (game.board[i][i] == game.player) {
            successPlayerDiagonalRev++;
            if (successPlayerDiagonalRev == 3) {
                console.log('successPlayerDiagonalBackward');
                return 1;
            }
        } else if (game.board[i][i] == game.player) {
            successOpponentDiagonalRev++;
            if (successOpponentDiagonalRev == 3) {
                console.log('successOpponentDiagonalRev');
                return 1;
            }
        }
    }
}


QUnit.test('Sprawdzanie warunku końca gry - sama funkcja', function (assert) {
    game.board =  [[1, 0, 1], [1, 1, 0], [1, 0, 1]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[1, 0, 1],[1, 1, 0], [1, 0, 1]]');
    
    game.board =  [[0, 1, 1], [2, 1, 0], [2, 1, 1]];
    assert.deepEqual( score(game), 1, 'Koniec gry, wygrywa krzyżyk pionowo; tablica = [[1, 0, 1],[1, 1, 0], [1, 0, 1]]');
      
        
    game.board = [[0, 0, 0], [2, 0, 0], [2, 2, 2]];
    assert.deepEqual( score(game), -1, 'Koniec gry: tablica = [[0, 0, 0], [2, 0, 0], [2, 2, 2]]');

    game.board = [[2, 2, 2], [2, 0, 0], [2, 2, 2]];
    assert.equal( score(game), undefined, 'Dalsza gra tablica = [[2, 2, 2], [2, 0, 0], [2, 2, 2]]');
//     assert.deepEqual(win(game.player, [[2, 2, 2], [2, 2, 2], [0, 0, 0]]), true, 'Koniec gry: tablica = [[2, 2, 2], [2, 2, 2], [0, 0, 0]]');
//     assert.deepEqual(win(game.player, [[0, 2, 2], [0, 2, 2], [0, 2, 2]]), true, 'Koniec gry: tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
//     assert.deepEqual(win(game.player, [[2, 0, 2], [2, 0, 2], [2, 0, 2]]), true, 'Koniec gry: tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
//     assert.deepEqual(win(game.player, [[2, 2, 0], [2, 2, 0], [2, 2, 0]]), true, 'Koniec gry: tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
//     assert.deepEqual(win(game.player, [[0, 2, 2], [2, 0, 2], [2, 2, 0]]), true, 'Koniec gry: tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
//     assert.deepEqual(win(game.player, [[2, 2, 0], [2, 0, 2], [0, 2, 2]]), true, 'Koniec gry: tablica = [[0, 2, 2], [0, 2, 2], [0, 2, 2]]');
//     assert.deepEqual(win(game.player, [[0, 2, 0], [2, 2, 2], [2, 2, 2]]), false, 'Dalej gra: tablica = [[0, 2, 0], [2, 2, 2], [2, 2, 2]]');
//     assert.deepEqual(win(game.player, [[2, 2, 2], [0, 0, 2], [2, 2, 2]]), false, 'Dalej gra: tablica = [[2, 2, 2], [0, 0, 2], [2, 2, 2]]');
//     assert.deepEqual(win(game.player, [[2, 0, 2], [0, 0, 2], [0, 2, 0]]), false, 'Dalej gra: tablica = [[2, 0, 2], [0, 0, 2], [0, 2, 0]]');
//     // assert.deepEqual(win(game.player, [[0, 0, 1], [2, 2, 2], [2, 2, 2]]), false, 'Dalej gra: tablica = [[0, 0, 1], [2, 2, 2], [2, 2, 2]];');

});


// QUnit.test('test2', function (assert) {
//     board = [[0, 0, 1], [2, 2, 2], [2, 2, 2]];
//     assert.deepEqual(win(game.player, board), false, 'Dalej gra: tablica = [[0, 0, 1], [2, 2, 2], [2, 2, 2]];');

// });


// function score (game) {
//     if (win(game.player)) {
//         return 10;
//     } else if (win(game.opponent)) {
//         return -10;
//     } else
//         return 0;
// }