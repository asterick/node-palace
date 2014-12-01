var Types = require("./types");

function box(value) {
	if (value instanceof Types.Base) {
		return value;
	}

	switch (typeof value) {
	case 'number':
		return new Types.Number(value);
	case 'string':
		// TODO: Escape slashes
		return new Types.String(value);
	case 'boolean':
		return new Types.Number(value ? 1 : 0);
	case 'object':
		if (Array.isArray(value)) {
			return new Types.Array(value.map(box));
		}
	default:
		throw new Error("Cannot coerse " + JSON.stringify(value) + " to Iptscrae type");
	}
}

module.exports = {
	box: box
};
