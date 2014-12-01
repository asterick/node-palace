var Types = require("./types"),
	FlowControl = require("./flowcontrol"),
	ExecutionError = require("./error");

var Exit = {},
	Return = {},
	Break = {};

function Context(globals, commands) {
	this._globals = globals || {};

	if (commands) {
		this._commands = commands;
	} else {
		this._commands = {};
		this.map(this.base_commands);
	}
}

Context.prototype.map = function (commands) {
	for (var call in commands) {
		this._commands[call] = new Types.Function(commands[call]);
	}
};

Context.prototype.extend = function (commands) {
	var ctx = new Context(this._globals, this._commands);

	if (commands) {
		ctx.map(commands);
	}

	return ctx;
};

Context.prototype.execute = function (data) {
	var context = {
		locals: Object.create(this._commands),
		stack: [],
		runtime: this
	};

	data.execute(context);
};

Context.prototype.getGlobal = function (name) {
	return this._globals[name] || (this._globals[name] = new Types.Reference(name));
};

Context.prototype.base_commands = require("./library/base");
module.exports = Context;
