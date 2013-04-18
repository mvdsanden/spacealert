var path = require('path');

exports.options =
{

	server:
	{
		port: 8080,
		address: '127.0.0.1',
		documentRoot: path.join(process.cwd(), 'www')
	}

};
