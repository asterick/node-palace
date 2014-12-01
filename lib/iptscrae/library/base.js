var Parser = require("../grammar.pegjs"),
	Types = require("../types"),
	FlowControl = require("../flowcontrol"),
	ExecutionError = require("../error");

function type_value(value) {
	// Note: ArrayMarks don't occur as we do syntax enforcement

	switch (value.constructor) {
		case Types.Number:
			return 1;
		case Types.Reference:
			return 2;
		case Types.AtomList:
			return 3;
		case Types.String:
			return 4;
		case Types.Array:
			return 6;
		default:
			return 0;
	}
}

function valuecall(call, value) {
	var rest = Array.prototype.slice.call(arguments, 2).map(function (v) {
		return v.dereference();
	});

	if (!value.respondsTo(call)) {
		throw new ExecutionError("Value cannot respond to " + call);
	}

	var elem = value.dereference();

	return elem[call].apply(elem, rest);
}

function assigncall(call, ref) {
	var rest = Array.prototype.slice.call(arguments, 2).map(function (v) {
		return v.dereference();
	});

	var value = ref.dereference();

	if (!ref.respondsTo('assign')) {
		throw new ExecutionError("Cannot assign to non-reference type");
	}

	if (!value.respondsTo(call)) {
		throw new ExecutionError("Value cannot respond to " + call);
	}

	ref.assign(value[call].apply(value, rest));
}

module.exports = {
	// Time functions
	"alarmexec": function (ref, time) { /* todo */ },
	"delay": function (time) { /* todo */ },
	"ticks": function () { /* todo */ },
	"datetime": function () {
		return new Types.Number(Math.floor((new Date() - new Date(1970, 0, 1)) / 1000));
	},

	// Flow control functions
	"break": function () {
		throw FlowControl.Break;
	},

	"exit": function () {
		throw FlowControl.Exit;
	},

	"return": function () {
		throw FlowControl.Return;
	},

	"exec": function (value) {
		value.execute(this);
	},

	"if": function (when_true, condition) {
		if (!condition.respondsTo('toBoolean')) {
			throw new ExecutionError("Type does not coerse to conditional");
		}

		if (condition.toBoolean()) {
			when_true.execute(this);
		}
	},

	"ifelse": function (when_true, when_false, condition) {
		if (!condition.respondsTo('toBoolean')) {
			throw new ExecutionError("Type does not coerse to conditional");
		}

		if (condition.toBoolean()) {
			when_true.execute(this);
		} else {
			when_false.execute(this);
		}
	},

	"while": function (while_true, condition) {
		for (;;) {
			condition.execute(this);
			var test = this.stack.pop();

			if (!test.respondsTo('toBoolean')) {
				throw new ExecutionError("Type does not coerse to conditional");
			}

			if (!test.toBoolean()) { break ; }

			while_true.execute(this);
		}
	},

	"foreach": function (ref, iter) {
		if (!iter.respondsTo('forEach')) {
			throw new ExecutionError("Type is not an iterable");
		}

		iter.forEach(function (data) {
			this.stack.push(data);
			ref.execute(this);
		}, this);
	},

	// Type Coersion
	"atoi": function (value) {
		return value.coerse(Types.Number);
	},

	"itoa": function (value) {
		return value.coerse(Types.String);
	},

	// Array functions
	"array": function (count) {
		var arr = [];
		while (count-- >= 0) arr.push(new Types.Number());
		return new Types.Array(arr);
	},

	"get": function (array, index) {
		if (!array.respondsTo('get')) {
			throw new ExecutionError("Type does not support length operation");
		}

		return array.get(index.dereference());
	},
	"put": function (data, array, index) {
		if (!array.respondsTo('get')) {
			throw new ExecutionError("Type does not support length operation");
		}

		array.put(index.dereference(), data);
	},

	"length": function (array) {
		if (!array.respondsTo('length')) {
			throw new ExecutionError("Type does not support length operation");
		}

		return new Types.Number(array.length());
	},

	// Stack manipulation
	"pop": function (drop) {
	},

	"dup": function (value) {
		this.stack.push(value);
		this.stack.push(value);
	},

	"over": function () {
		return this.stack[this.stack.length - 2];
	},

	"pick": function (n) {
		return this.stack[this.stack.length - n - 1];
	},

	"swap": function (a, b) {
		this.stack.push(b);
		this.stack.push(a);
	},

	"stackdepth": function () {
		return new Types.Number(this.stack.length);
	},

	"random": function (max) {
		return new Types.Number(Math.floor(max * Math.random()));
	},

	"toptype": function () {
		var top = this.stack[this.stack.length - 1];

		return new Types.Number(type_value(top));
	},

	"vartype": function () {
		var top = this.stack[this.stack.length - 1];

		return new Types.Number(top ? type_value(top.dereference()) : 0);
	},

	// String manipulation
	"grepstr": function (string, pattern) { /* todo */ },

	"grepsub": function () { /* todo */ },

	"lowercase": function (value) {
		if (!array.respondsTo('lowercase')) {
			throw new ExecutionError("Type does not support lowercase operation");
		}

		return value.lowercase();
	},

	"uppercase": function (value) {
		if (!array.respondsTo('uppercase')) {
			throw new ExecutionError("Type does not support uppercase operation");
		}

		return value.uppercase();
	},

	"strindex": function (string, find) {
		return valuecall('indexOf', string, find);
	},

	"strlen": function (string) {
		return valuecall('length', string);
	},

	"strtoatom": function (source) {
		return Parser.parse("{"+source+"}", { types: require("../types") })[0];
	},

	"substr": function (string, find) {
		return valuecall('contains', string, find);
	},

	"substring": function (string, off, len) {
		return valuecall('substring', string, off, len);
	},

	// Other functions
	"iptversion": function () {
		return new Types.Number(1);
	},

	"def": function (value, ref) {
		if (!ref.is(Types.Reference)) {
			throw new ExecutionError("Assignment to non-reference");
		}

		ref.assign(value.dereference());
	},

	"global": function (ref) {
		if (!ref.is(Types.Reference)) {
			throw new ExecutionError("Value is not a reference type");
		}

		var name = ref.getName();
		this.locals[name] = this.runtime.getGlobal(name);
	},

	"sine": function (angle) {
		return valuecall("sine", angle);
	},

	"cosine": function (angle) {
		return valuecall("cosine", angle);
	},

	"tangent": function (angle) {
		return valuecall("tangent", angle);
	},

	"squareroot": function (value) {
		return valuecall("squareroot", value);
	},

	"=": function (value, ref) {
		if (!ref.respondsTo("assign")) {
			throw new ExecutionError("Argument does not respond to assignments");
		}

		ref.assign(value.dereference());
	},

	"!": function (value) {
		if (!value.respondsTo('toBoolean')) {
			throw new ExecutionError("Type does not coerse to conditional");
		}

		return new Types.Number(value.toBoolean() ? 0 : 1);
	},

	"not": function (value) {
		if (!value.respondsTo('toBoolean')) {
			throw new ExecutionError("Type does not coerse to conditional");
		}

		return new Types.Number(value.toBoolean() ? 0 : 1);
	},

	"and": function (a, b) {
		a = a.dereference();
		b = b.dereference();

		if (!a.respondsTo('toBoolean') && !b.respondsTo('toBoolean')) {
			throw new ExecutionError("Type does not coerse to conditional");
		}

		return new Types.Number((a.toBoolean() && b.toBoolean()) ? 0 : 1);
	},

	"or": function (a, b) {
		a = a.dereference();
		b = b.dereference();

		if (!a.respondsTo('toBoolean') || !b.respondsTo('toBoolean')) {
			throw new ExecutionError("Type does not coerse to conditional");
		}

		return new Types.Number((a.toBoolean() || b.toBoolean()) ? 1 : 0);
	},

	"+": function (left, right) {
		return valuecall("add", left, right);
	},

	"+=": function (value, ref) {
		assigncall('add', ref, value);
	},

	"-": function (left, right) {
		return valuecall("subtract", left, right);
	},

	"-=": function (value, ref) {
		assigncall('subtract', ref, value);
	},

	"*": function (left, right) {
		return valuecall("multiply", left, right);
	},

	"*=": function (value, ref) {
		assigncall('multiply', ref, value);
	},

	"/": function (left, right) {
		return valuecall("divide", left, right);
	},

	"/=": function (value, ref) {
		assigncall('divide', ref, value);

	},

	"%": function (left, right) {
		return valuecall("modulo", left, right);
	},

	"%=": function (value, ref) {
		assigncall('modulo', ref, value);
	},

	"++": function (ref) {
		assigncall('add', ref, new Types.Number(1));
	},

	"--": function (ref) {
		assigncall('subtract', ref, new Types.Number(1));
	},

	"==": function (left, right) {},
	"!=": function (left, right) {},
	"<>": function (left, right) {},
	"<=": function (left, right) {},
	">=": function (left, right) {},
	"<": function (left, right) {},
	">": function (left, right) {},

	"&": function (left, right) {
		return valuecall("concatenate", left, right);
	}
};
