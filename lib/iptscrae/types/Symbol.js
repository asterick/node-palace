var Types = require("./index"),
	ExecutionError = require("../error");

function IptSymbol(name) {
	this._name = name;
}

Types.Base.extend(IptSymbol);

IptSymbol.prototype.reference = function (context) {
	if (context.locals[this._name] === undefined) {
		context.locals[this._name] = new Types.Reference(this._name);
	}

	context.locals[this._name].reference(context);
};

IptSymbol.prototype.toString = function () {
	return this._name;
};

module.exports = IptSymbol;
