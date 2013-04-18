var game = require('./spal_model.js');

game.board.append(new game.Piece());

console.log("Test");
console.log("Piece 0: " + game.board.pieces[0].position);