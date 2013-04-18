var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	util = require('util'),
	config = require('./spal_config.js'),
	mimes = require('./spal_mimetypes.js'),
	game = require('./spal_model.js');


var sendError = function(res, code, text)
{
	res.writeHead(code, {'Content-Type': 'text/plain'});
	res.end(text);
};

var sendFile = function (res, filename)
{
	// Construct the local file path.
	var pathname = path.join(config.options.server.documentRoot, filename);
		
	// Check if the file exists.
	fs.exists(pathname, function (exists) {
		
		// If it does not exists send error page.
		if (!exists) {
			sendError(res, 404, 'File Not Found (' + pathname + ')');
			return;
		}
			
		// Write the header with the correct mime type.
		res.writeHeader(200, mimes.getMimeType(pathname));
			
		// Open the file and pipe it to the response.
		var fileStream = fs.createReadStream(pathname);
		fileStream.pipe(res);
		
	});
};
	
var sendUnknown = function (res)
{
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('okay');
}

var api0Pieces = function (tree, query, res)
{
	console.log(util.inspect(query));

	// If nothing follows the query, list pieces.
	if (!tree.length) {

		var pieces = {};
	
		if (query.query.laststep) {
			query.query.laststep = Number(query.query.laststep);
	
			console.log("Filtering pieces..");
			pieces = game.board.filterPieces(function (piece)
			{
				return piece.updateStep > query.query.laststep;
			});
		} else {
			pieces = game.board.pieces;
		}

		res.body.pieces = pieces;

//		sendError(res, 200, JSON.stringify(pieces));
	
	} else {
	
		var piece = game.board.pieces[Number(tree[0])];
		
		// If the piece exists.
		if (piece) {
		
			// Find out what to do.
			if (query.query.call) {
				switch (query.query.call) {
				case 'setpos':
					piece.position.x = Number(query.query.x);
					piece.position.y = Number(query.query.y);
					piece.updateStep = ++game.board.step;
					break;
				};
			}

			res.body.piece = piece;
		
//			sendError(res, 200, JSON.stringify(piece));
		} else {
			res.code = 404;
//			sendError(res, 404, '');
		}
	
	}
}

var handleApi0Request = function (tree, query, res)
{

	res.body.api = 0;

	if (tree[0] == 'pieces') {
		api0Pieces(tree.splice(1), query, res);
	} else {
		res.code = 404;
		res.body.error = "Api call unknown (" + util.inspect(tree) + ").";
	}
	
	// Add the step number to the body.
	res.body.step = game.board.step;

}


var handleRequest = function (req, res)
{
	// Check if we really got an request.
	if (!req) return;	
		
	console.log("Request: " + req.url);
		
	// Parse the query.
	var query = url.parse(req.url, true);
		
	// Check if we need to send the root document.
	switch (query.pathname) {
	case '/':
		sendFile(res, 'index.html');
		return;
	
	case 'favicon.ico':
		sendError(res, 404, '');
		return;
	};
		
	var tree = query.pathname.split('/').splice(1);
		
	console.log("Tree: " + util.inspect(tree));
		
	if (tree[0] == 'api') {
		
		var result = {code: 404, body: {}};
		
		if (tree[1] == '0') {
			handleApi0Request(tree.splice(2), query, result);
		} else {
			result.code = 404;
			result.body.error = 'Unknown API version (' + tree[1] + ')';
		}
		
		sendError(res, result.code, JSON.stringify(result.body));
		
	} else {
		
		sendUnknown(res);
		
	}
		
};

module.exports = new function()
{

	/// This initializes the http server.
	this.initialize = function (port, address)
	{
		this.server.listen(port, address, function (req, res) { handleRequest(req, res); });
	};

	// Create the actual http server.
	this.server = http.createServer(handleRequest);

};
