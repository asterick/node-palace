function Grep() {
	this.matches = [];
}

Grep.prototype.compile = function (pattern) {
	var group = false,
		regex = pattern.replace(/\\.|./g, function (ch) {
			if (ch[0] == '\\') { return ch; }

			if (group) {
				if (ch === ']') { group = false; }
				return ch;
			} else if (ch === '[') {
				group = true;
				return ch;
			}

			switch (ch) {
				case "a": case "b": case "c": case "d":
				case "e": case "f": case "g": case "h":
				case "i": case "j": case "k": case "l":
				case "m": case "n": case "o": case "p":
				case "q": case "r": case "s": case "t":
				case "u": case "v": case "w": case "x":
				case "y": case "z":

				case "A": case "B": case "C": case "D":
				case "E": case "F": case "G": case "H":
				case "I": case "J": case "K": case "L":
				case "M": case "N": case "O": case "P":
				case "Q": case "R": case "S": case "T":
				case "U": case "V": case "W": case "X":
				case "Y": case "Z":

				case '(': case ')': case '^': case '$':
				case '*': case '+': case '.':
					return ch;
				default:
					return "\\" + ch;
			}
		});

	// This might not be all inclusive, requires further testing
	return new RegExp(regex);
};

Grep.prototype.match = function (pattern, string) {
	var regexp = this.compile(pattern);

	this.matches = string.match(regexp);
	return this.matches;
};

Grep.prototype.replace = function (pattern) {
	var matches = this.matches;

	return pattern.replace(/\$([1-9])/g, function (_, i) {
		return matches[parseInt(i, 10)] || "";
	});
};

module.exports = Grep;

