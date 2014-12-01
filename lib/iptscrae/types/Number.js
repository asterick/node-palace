var Types = require("./index"),
	ExecutionError = require("../error");

function IptNumber (value) {
	this._value = value || 0;
}

Types.Base.extend(IptNumber);

IptNumber.prototype.toString = function () {
	return this._value.toString(10);
};

IptNumber.prototype.toNumber = function () {
	return this._value;
};

IptNumber.prototype.toBoolean = function () {
	return this._value !== 0;
};

IptNumber.prototype.coerse = function (type) {
	if (type == IptNumber) {
		return this;
	} else if (type == Types.String) {
		return new Types.String(this.toString());
	} else {
		throw new ExecutionError("Do not know how to coerse to this type");
	}
};

IptNumber.prototype.sine = function () {
	var angle = this._value * Math.PI / 180,
		root = Math.floor(Math.sin(angle)*1000);

	console.log(this._value, Math.PI, 180);

	return new IptNumber(root);
};

IptNumber.prototype.cosine = function () {
	var angle = this._value * Math.PI / 180,
		root = Math.floor(Math.cos(angle)*1000);

	return new IptNumber(root);
};

IptNumber.prototype.tangent = function () {
	var angle = this._value * Math.PI / 180,
		root = Math.floor(Math.tan(angle)*1000);

	return new IptNumber(root);
};

IptNumber.prototype.squareroot = function () {
	var root = Math.floor(Math.sqrt(this._value));

	return new IptNumber(root);
};

IptNumber.prototype.add = function (right) {
	// This becomes a string concatenation
	if (right.is(Types.String)) {
		return this.coerse(Types.String).add(right);
	}

	return new IptNumber(this._value + right.coerse(Types.Number)._value);
};

IptNumber.prototype.subtract = function (right) {
	return new IptNumber(this._value - right.coerse(Types.Number)._value);
};

IptNumber.prototype.multiply = function (right) {
	return new IptNumber(this._value * right.coerse(Types.Number)._value);
};

IptNumber.prototype.divide = function (right) {
	return new IptNumber(Math.floor(this._value / right.coerse(Types.Number)._value));
};

IptNumber.prototype.modulo = function (right) {
	return new IptNumber(this._value % right.coerse(Types.Number)._value);
};

IptNumber.prototype.concatenate = function (right) {
	return this.coerse(Types.String).concatenate(right);
}

module.exports = IptNumber;
