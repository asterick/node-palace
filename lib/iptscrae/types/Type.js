var ExecutionError = require("../error");

function IptType() {
}

IptType.extend = function (child) {
	child.prototype = Object.create(IptType.prototype, {
		constructor: { value: child }
	});
};

IptType.prototype.must = function (type) {
	if (!this.is(type)) {
		throw new ExecutionError("Cannot operate on this type");
	}

	return this;
};

IptType.prototype.coerse = function () {
	throw new ExecutionError("This type does not support coersion");
};

IptType.prototype.execute = function (context) {
	this.reference(context);
};

IptType.prototype.reference = function (context) {
	context.stack.push(this);
};

IptType.prototype.dereference = function () {
	return this;
};

IptType.prototype.respondsTo = function (call) {
	return typeof this[call] == "function";
};

IptType.prototype.is = function (base) {
	var proto = Object.getPrototypeOf(this);

	while (proto) {
		if (proto == base.prototype) { return true ; }
		proto = Object.getPrototypeOf(proto);
	}

	return false;
};

module.exports = IptType;
