var fs = require("fs"),
	PEG = require("pegjs"),
	through = require("through"),
	path = require("path");

Parser = PEG.buildParser(fs.readFileSync(__dirname + "/grammar.pegjs", 'utf-8'), { cache: true });

function transform(file, options) {
	if (path.extname(file) !== ".def") return through();

	options = options || {};
	options.output = "source";

	var src = "";
	return through(write, end);

	function write(chunk) {
		src += chunk.toString("utf-8");
	}

	function end() {
		var contents = "module.exports = " + JSON.stringify(Parser.parse(src), null, 4);
		this.emit("data", contents);
		this.emit("end");
	}
}

module.exports = {
	parse: Parser.parse,
	transform: transform
};
