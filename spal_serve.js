var config = require('./spal_config.js'),
	server = require('./spal_httpserver.js'),
	util = require('util'),
	game = require('./spal_model.js'),
	initBoard = require('./spal_initboard.js');

/// Start the http server on the configured port.
server.initialize(config.options.server.port, config.options.server.address);

console.log("InitBoard: " + util.inspect(initBoard));

game.board.initializeWith(initBoard);

game.board.append(new game.Piece({position: [10, 10], type: 'energy'}));
game.board.append(new game.Piece());

game.board.pieces[0].updateStep = 20;