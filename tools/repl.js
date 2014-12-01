require("../index.js");

var VERSION = "0.0.1";

var Iptscrae = require("../lib/iptscrae"),
	readline = require('readline');

function left(value, length) {
	while (value.length < length) { value += " "; }
	return value;
}

function right(value, length) {
	while (value.length < length) { value = " " + value; }
	return value;
}

function repeat(string, count) {
	var out = "";
	while (count-- > 0) { out += string; }
	return out;
}

function dump(list) {
	var valueLength = 5,
		nameLength = 4,
		pairs = [];

	Object.keys(list).forEach(function (name) {
		var value = list[name].dereference().toString();

		nameLength = Math.max(nameLength, name.length);
		valueLength = Math.max(valueLength, value.length);

		pairs.push({ name: name, value: value });
	});

	console.log();
	console.log(right("name", nameLength), "|", left("value", valueLength));
	console.log(repeat("-", nameLength), "+", repeat("-", valueLength));
	pairs.forEach(function (data) {
		console.log(right(data.name, nameLength), "|", left(data.value, valueLength));
	});
	console.log();
}

var runtime = new Iptscrae.Runtime().extend({
		"print": function (top) {
			console.log(top);
		},
		"log": function (value) {
			console.log(value.toString());
		},
		"globals": function () {
			dump(this.runtime._globals);
		},
		"locals": function () {
			dump(this.locals);
		}
	});

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', function (cmd) {
	try {
		var parse = Iptscrae.parse("{" + cmd + "}"),
			context = runtime.execute(parse[0]);
			stack = context.stack.map(function (v) {
				return v.toString();
			});

		console.log("Stack ->", stack.length.toString(), "|", stack.reverse().join(" "));
	} catch (e) {
		console.error("ERROR: ", e.message);
	}

	console.log();
	rl.prompt();
});



console.log("Iptscript REPL:", VERSION);
rl.setPrompt(">> ");
rl.prompt();

