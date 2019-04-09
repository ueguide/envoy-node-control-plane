const crypto = require('crypto')

module.exports = function ( input ) {
	return crypto.createHash('md5')
					.update(JSON.stringify( input ))
					.digest('hex')
					.slice(0, 10)
}
