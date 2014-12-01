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
	if (type == Types.String) {
		return new Types.String(this.toString());
	} else {
		throw new ExecutionError("Do not know how to coerse to this type");
	}
};

IptNumber.prototype.add = function (right) {
	if (right.is(Types.Number)) {
		return new IptNumber(this._value + right._value);
	} else if (right.is(Types.String)) {
		this.coerse(Types.String).add(right);
	}

	return new IptNumber(this._value + right._value);
};

IptNumber.prototype.subtract = function (right) {
	if (!right.is(Types.Number)) {
		throw new ExecutionError("Do not know how to subtract");
	}

	return new IptNumber(this._value - right._value);
};

IptNumber.prototype.multiply = function (right) {
	if (!right.is(Types.Number)) {
		throw new ExecutionError("Do not know how to multiply");
	}

	return new IptNumber(this._value * right._value);
};
IptNumber.prototype.divide = function (right) {
	if (!right.is(Types.Number)) {
		throw new ExecutionError("Do not know how to divide");
	}

	return new IptNumber(Math.floor(this._value / right._value));
};

IptNumber.prototype.modulo = function (right) {
	if (!right.is(Types.Number)) {
		throw new ExecutionError("Do not know how to modulo");
	}

	return new IptNumber(this._value % right._value);
};

module.exports = IptNumber;
