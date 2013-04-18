var util = require('util');

/// A point on the board.
exports.Point = function (_x, _y)
{
	this.x = _x;
	this.y = _y;
	
//	this.toString = function () { return "(" + this.x + ", " + this.y + ")"; }
}

// The default values for a piece.
const defaultPiece = {type: 'void', position: [0, 0]};

/// This is a board piece.
exports.Piece = function (values)
{
	if (!values) values = defaultPiece;

    /// The position on the board of the piece.
    this.position = new exports.Point(values.position[0], values.position[1]);

	/// The type of the piece (e.g. 'energy', 'player0', 'damage', ...).
	this.type = values.type;

    /// Every action in the game has an update step associated
    /// with it, so the game knows in which order actions are
    /// performed.
    this.updateStep = 0;

}

/// This is a game board.
exports.Board = function ()
{
    /// The list of pieces on the board (\see Piece).
    this.pieces = {};

    /// The current game update step.
    this.step = 0;

	/// This counts the number of pieces that has been created.
	this.pieceCounter = 0;

    /// With this fuction you can add pieces to the board.
    this.append = function (piece) {
		this.pieces[this.pieceCounter] = piece;
		return this.pieceCounter++;
    };

	this.initializeWith = function (pieces) {
	
		for (var i in pieces) {
		
			var piece = pieces[i];
		
			console.log("Append: " + util.inspect(piece));
		
			this.append(new exports.Piece(piece));
		
		}
	
	};

	this.filterPieces = function (cb) {
		var res = {};
		
		for (var i in this.pieces) {
		
			var val = this.pieces[i];
		
			if (cb(val)) res[i] = val;
		
		}
	
		return res;
	};

    /// Increments the game update step.
    this.incStep = function () { this.step++; };

}

/// The boards pieces.
exports.board = new exports.Board();
