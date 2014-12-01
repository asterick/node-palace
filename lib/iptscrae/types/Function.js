var Types = require("./index"),
	ExecutionError = require("../error");

var Utils = require("../util");

function arg_names(funct) {
	var names = funct.toString()
		.replace(/\/\*(.*?)\*\/|\/\/.*?[\n\r]/g, "")
		.replace(/\s+/g,"")
		.match(/\((.*?)\)/)[1];

	if (!names) { return []; }

	return names.split(",");
}

function IptFunction(call) {
	this._call = call;
	this._arguments = arg_names(call);
}

Types.Base.extend(IptFunction);

IptFunction.prototype.reference = function (context) {
	var stack = context.stack;

	if (stack.length < this._arguments.length) {
		throw new ExecutionError("Stack underflow");
	}

	var count = this._arguments.length,
		kargs = stack.splice(stack.length - count, count);

	var result = this._call.apply(context, kargs);

	if (result !== undefined) {
		context.stack.push(Utils.box(result));
	}
};

IptFunction.prototype.toString = function () {
	return "[System Call]";
};

module.exports = IptFunction;
