//  board is 2d arr 

// let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let game = {
    player: 'o',
    computer: 'x'
};
// let allCombinationOfSuccess = [] czy da sie tu zrobic liste?

// # @player is the turn taking player
function win (player, board) {
    function boardChecker (array) {
        let success = 0;
        
        for (let i = 0; i <= 2; i++) {
            if (array[i, 0] == player) {
                success++;
                if (success == 3) {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 0; i <= 2; i++) {
            if (array[0, i] == player) {
                success++;
                if (success == 3) {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 0; i <= 2; i++) {
            if (array[i, i] == player) {
                success++;
                if (success == 3) {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 0; i <= 2; i++) {
            if (array[2, i] == player) {
                success++;
                if (success == 3) {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 0; i <= 2; i++) {
            if (array[i, 2] == player) {
                success++;
                if (success == 3) {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 0; i <= 2; i++) {
            if (board[2-i, 2-i] == player) {
                success++;
                if (success == 3) {
                    return true;
                } else {
                    break;
                }
            }
        }
        return false;
    }
    boardChecker(board);


}

function score (game) {
    if (win(game.player)) {
        return 10;
    } else if (win(game.opponent)) {
        return -10;
    } else
        return 0;
}
// score(game);
let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
win(game, board);