/**
 ** This is a TERRIBLE encryption scheme, and is not
 ** cryptographically sound.  Do not use for anything other
 ** than the palace message decoding
 **/

var Random = require("./prng");

var CYPHER_SEED = 0xa2c2a;

function cypher(direction, message, start, end) {
	var noise = new Random(CYPHER_SEED);
	var last = 0;

	if (start === undefined) {
		start = 0;
	}
	if (end === undefined) {
		end = message.length - 1;
	}

	for (var i = end; i >= start; i--) {
		var input = message[i],
			output = input ^ last ^ noise.next();

		message[i] = output;
		last = (direction ? input : output) ^ noise.next();
	}
}

module.exports = {
	encode: cypher.bind(null, false),
	decode: cypher.bind(null, true)
};
