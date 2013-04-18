var path = require('path');

var mimeTypes = {
    ".html": "text/html",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".js": "text/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".": "text/plain",
    "": "text/plain"
};

exports.getMimeType = function (filename)
{
	var ext = path.extname(filename);
	var mimeType = mimeTypes[ext];
	
	return (mimeType?mimeType:"text/plain");
}
