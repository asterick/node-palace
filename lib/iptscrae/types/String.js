var Types = require("./index"),
	ExecutionError = require("../error");

function IptString (value) {
	this._value = value;
}

Types.Base.extend(IptString);

IptString.prototype.toString = function () {
	// Strip out escapement slashes
	return JSON.stringify(this._value.replace(/\\(.)/g, function (_, m) {
		return m;
	}));
};

IptString.prototype.coerse = function (type) {
	if (type == Types.Number) {
		return new Types.Number(Number(this._value, 10));
	} else {
		throw new ExecutionError("Do not know how to coerse to this type");
	}
};

IptString.prototype.lowercase = function () {
	return new IptString(this._value.toLowerCase());
};

IptString.prototype.uppercase = function () {
	return new IptString(this._value.toUpperCase());
};

IptString.prototype.add = function (right) {
	if (right.is(Types.Number)) {
		right = right.coerse(IptString);
	}

	return new IptString(this._value + right._value);
};

module.exports = IptString;
