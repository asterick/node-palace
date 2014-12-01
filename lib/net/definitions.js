var Encoding = require("../encoding"),
	Cypher = require("../crypto/cypher"),
	Stream = require("../util/stream");

function multiread(sizes, read) {
	if (sizes.length === 0) {
		return read();
	}

	var output = [];

	for (var i = 0; i < sizes[0]; i++) {
		output.push(multiread(sizes.slice(1), read));
	}

	return output;
}

function Defintions(defintion) {
	this._defintion = defintion;
}

Defintions.prototype.compute = function (context, exp) {
	switch (exp.type) {
	case 'Number':
		return exp.value;
	case 'String':
		return exp.value;
	case 'Symbol':
		if (context[exp.name] === undefined) {
			throw new Error("Undefined value " + exp.name);
		}

		return context[exp.name];

	case 'UnaryOperator':
		var value = this.compute(context, exp.value);

		switch (exp.operator) {
			case '-':
				return -value;
			default:
				throw new Error("Unknown unary operator: " + exp.operator);
		}

	case 'BinaryOperator':
		var left = this.compute(context, exp.left),
			right = this.compute(context, exp.right);

		switch (exp.operator) {
			case '+': return left + right;
			case '-': return left - right;
			case '*': return left * right;
			case '/': return Math.floor(left / right);
			case '%': return left % right;
			default:
				throw new Error("Unknown binary operator: " + exp.operator);
		}

	default:
		throw new Error("Unknown expression type: " + exp.type);
	}
};

Defintions.prototype.decode = function (stream) {
	var that = this;

	function decodeStringArray(encoding, array, reversed) {
		if (Array.isArray(0)) {
			return array.map(function (a) {
				return decodeStringArray(encoding, a);
			});
		}

		var enc = new Encoding(encoding),
			str;

		enc.update(array);
		str = enc.toString();

		if (reversed) {
			return str.split("").reverse().join("");
		}

		return str;
	}

	function decodeSwitchStatement(context, test, clauses) {
		var found = clauses.reduce(function (acc, clause) {
			switch (clause.type) {
				case 'CaseClause':
					return (that.compute(context, clause.test) == test) ? clause.body : acc;
				case 'DefaultClause':
					return acc || clause.body;
				default:
					throw new Error("Unknown switch clause type: " + clause.type);
			}
		}, null);

		if (!found) {
			throw new Error("Cannot match " + test + " to switch clause body");
		}

		return decodeType(context, found);
	}

	function decodeType(context, type) {
		var size = type.size.map(function (exp) {
				return that.compute(context, exp);
			}),
			target = stream;

		if (type.encoded) {
			var bytes = size.reduce(function (acc, total) {
				return acc * total;
			}, Math.ceil((type.width || 1) / 8));

			var data = multiread([bytes], target.read.bind(target));
			Cypher.decode(data);

			target = new Stream(data);
		}

		switch (type.type) {
		case 'ConstantType':
			return that.compute(context, type.value);

		case 'StringType':
			if (size.length === 0) {
				throw new Error("Decode Error: Unsized string");
			}

			var chars = multiread(size, target.read.bind(target));
			return decodeStringArray(type.encoding, chars, type.reversed);

		case 'IntegerType':
			return multiread(size, target.read.bind(target, that.compute(context, type.width), type.signed));

		case 'SwitchStatement':
			if (type.cypher) {
				throw new Error("Cannot handle cyphers on block structures");
			}

			return decodeSwitchStatement(context, that.compute(context, type.test), type.clauses);

		case 'StructureType':
			if (type.cypher) {
				throw new Error("Cannot handle cyphers on block structures");
			}

			function read() {
				var align = that.compute(context, type.alignment),
					base = stream.tell(),
					result = decodeInstance(context, type.body),
					end = stream.tell(),
					size = end - base;

				if (size % align) {
					stream.skip(align - size % align);
				}

				return result;
			}

			return multiread(size, read);

		case 'UnionType':
			if (type.cypher) {
				throw new Error("Cannot handle cyphers on block structures");
			}

			var top = stream.tell(),
				scope = type.body.reduce(function (scope, instance) {
					stream.preserve();
					var value = decodeType(scope, instance.type);
					if (instance.name[0] !== '_') scope[instance.name] = value;
					top = Math.max(top, stream.tell());
					stream.restore();

					return scope;
				}, Object.create(context));

			stream.seek(top);

			return scope;

		default:
			throw new Error("Unknown type: " + type.type);
		}
	}

	function decodeInstance(context, instance) {
		var scope = Object.create(context),
			hidden = Object.create(scope);

		instance.forEach(function (instance) {
			var value = decodeType(hidden, instance.type);

			if (instance.name[0] === '_') {
				hidden[instance.name] = value;
			} else if (!Object.hasOwnProperty(scope, instance.name)) {
				scope[instance.name] = value;
			} else {
				throw new Error("Instance names must be unique");
			}

			return scope;
		});

		return scope;
	}

	return decodeInstance({}, this._defintion);
};

Defintions.prototype.encoder = function (struct) {

};

// Runs an encoding and verifies that it works
Defintions.prototype.verify = function (struct) {

};

module.exports = Defintions;
