var EncodingError = require("./error.js");

var encodings = {
	'ascii': require("./format/ascii"),
	'windows-1252': require("./format/windows-1252"),
	'utf-8': require("./format/utf-8.js")
};

function Encoding(method) {
	this._encoder = encodings[method];
	this._data = [];

	if (!this._encoder) {
		throw new EncodingError("Unrecognized encoding" + method);
	}
}

Encoding.prototype.update = function (array) {
	if (typeof array == "string") {
		array = array.split("").map(function (ch) {
			return String.charCodeAt(ch);
		});
	}

	this._data.push.apply(this._data, array);
};

// Convert encoded bytes into character codes
Encoding.prototype.decode = function () {
	return this._encoder.decode(this._data);
};

// Convert character codes into encoded bytes
Encoding.prototype.encode = function () {
	return this._encoder.encode(this._data);
};

Encoding.prototype.toString = function () {
	return this.decode().map(function (ch) {
		return String.fromCharCode(ch);
	}).join("");
};

module.exports = Encoding;
