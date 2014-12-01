var Types = require("./index"),
	ExecutionError = require("../error");

function IptReference(name, value) {
	this._value = null;
	this._name = name;
}

Types.Base.extend(IptReference);

IptReference.prototype.execute = function (context) {
	return this.dereference().execute(context);
};

IptReference.prototype.dereference = function () {
	return this._value || new Types.Number();
};

IptReference.prototype.toString = function () {
	return "&" + this._value.toString();
};

IptReference.prototype.getName = function () {
	return this._name;
};

IptReference.prototype.assign = function (value) {
	this._value = value;
};

module.exports = IptReference;
