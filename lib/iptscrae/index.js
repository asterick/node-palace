var Parser = require("./grammar.pegjs"),
	Runtime = require("./runtime");

module.exports = {
	parse: function (src) {
		return Parser.parse(src, { types: require("./types") });
	},

	SyntaxError: Parser.SyntaxError,
	Runtime: Runtime
};
