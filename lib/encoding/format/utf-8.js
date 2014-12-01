var EncodingError = require("../error.js");

function msb(value) {
	var index = 0;
	while (value) {
		index++;
		value >>>= 1;
	}
	return index;
}

function top_count(value) {
	var top = msb(value);

	if (!value) { return 0 ; }

	var count = 0;

	while (value & (1 << (top-- - 1))) count ++;

	return count;
}

function top(count) {
	return ((1 << count) - 1) << (8 - count);
}

function encode(chars) {
	return chars.reduce(function (bytes, code) {
		if (code < 0x80) {
			bytes.push(code);
			return bytes;
		}

		var bits = msb(code),
			tail = Math.floor(bits / 6);

		bits -= 6 * tail;

		while (8 - (tail + 2) < bits) {
			bits -= 6;
			tail ++;
		}

		bytes.push(top(tail+1) | (code >> (tail * 6)));

		for (var i = tail; i--; ) {
			bytes.push((code >> (i*6)) & 0x3F | 0x80);
		}

		return bytes;
	}, []);
}

function decode(bytes) {
	var out = [],
		shift_in,
		remaining = 0;

	var chars = bytes.reduce(function (chars, code) {
		if (code > 0x100) {
			throw new EncodingError("Expected values in byte ranges");
		}

		if (code < 0x80) {
			if (remaining) {
				throw new EncodingError("Incomplete character found");
			}

			chars.push(code);
			return chars;
		}

		var msbs = top_count(code);

		if (msbs > 1) {
			remaining = msbs - 1;
			code &= (1 << msbs) - 1;

			shift_in = code << (remaining * 6);
		} else if (remaining > 0) {
			shift_in |= (code & 0x3F) << (--remaining * 6);

			if (!remaining) { chars.push(shift_in); }
		} else {
			throw new EncodingError("Incomplete character encoding");
		}

		return chars;
	}, []);

	if (remaining) {
		throw new EncodingError("Incomplete character encoding");
	}

	return chars;
}

module.exports = {
	encode: encode,
	decode: decode
};
