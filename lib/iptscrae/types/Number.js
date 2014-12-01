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
	if (right.isIptNumber) {
		return new IptNumber(this._value + right._value);
	} else if (right.is(Types.String)) {
		this.coerse(Types.String).add(right);
	}

	return new IptNumber(this._value + right._value);
};

module.exports = IptNumber;
