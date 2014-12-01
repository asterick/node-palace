var EncodingError = require("../error.js");

function bound(v) {
	if (v >= 0x80) {
		throw new EncodingError("Invalid ascii character");
	}
	return v;
}

module.exports = {
	encode: bound,
	decode: bound
};

