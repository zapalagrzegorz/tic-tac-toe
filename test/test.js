

//  board is 2d arr 
// var board = [[0, 2, 0], [1, 2, 1], [1, 0, 2]];
// let availMoves = get_available_moves(board).reduce(function (acc, curr) {
//     return acc.concat(curr);
// }, []);

//  ... operator - used as spread operator
// var myNewArray4 = [].concat(...get_available_moves(board));
// console.log(myNewArray4);



var game = {
    player: 1,
    opponent: 0,
    current: 1,
    board: [
        [0, 2, 0],
        [1, 2, 1],
        [1, 0, 2]
    ]

};

function setScore(game) {
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
            if (game.board[i][j] != 2) {
                if (++draw == 9) {
                    return 0;
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
    for (let i = 2, j = 0; i >= 0; i-- , j++) {
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
    return undefined;
}

function get_available_moves(board) {
    let availableMoves = [];
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (board[i][j] == 2) {
                availableMoves.push([i, j])
            }
        }
    }
    return availableMoves;
}

function get_new_state() {
    // 
}

function minimax(game) {
    let score = setScore(game);
    if (score != undefined) return score;
    let scores = [];
    let moves = [];

    // Populate the scores array, recursing as needed
    // game.get_available_moves().forEach(function (move) {
    //     possible_game = game.get_new_state(move)
    //     scores.push(minimax(possible_game));
    //     moves.push(move);
    // }, this)
    // end

}
// let scoreGameTemp = minimax(game);
// console.log(score);
// console.log(get_available_moves(game.board));

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
    assert.deepEqual(get_available_moves(game.board), [[0,1],[0,2],[1,0],[1,1]], 'dostępne ruchy z tablicy [[0, 2, 0],[1, 2, 1],[1, 0, 2]] to 0,1, 1,1, 2,2');
});

