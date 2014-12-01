function Stream(array, big) {
	this._index = 0;
	this._data = array;
	this._stack = [];

	this.endian(big);
}

Stream.prototype.endian = function (big) {
	this.read = big ? this.read_big : this.read_little;
}

Stream.prototype.read_little = function (width, signed) {
	var bits = 0,
		value = 0;

	width || (width = 8);

	while (bits < width) {
		if (this._index >= this._data.length) {
			throw new Error("Underflow error");
		}

		value |= this._data[this._index++] << bits;
		bits += 8;
	}

	if (signed && value & (1 << (width - 1))) {
		value -= (1 << width);
	}

	return value;
};

Stream.prototype.read_big = function (width, signed) {
	width || (width = 8);

	var bits = width - 8,
		value = 0;

	while (bits >= 0) {
		if (this._index >= this._data.length) {
			throw new Error("Underflow error");
		}

		value |= this._data[this._index++] << bits;
		bits -= 8;
	}

	if (signed && value & (1 << (width - 1))) {
		value -= (1 << width);
	}

	return value;
};

Stream.prototype.preserve = function () {
	this._stack.push(this._index);
};

Stream.prototype.restore = function () {
	this._index = this._stack.pop();
};

Stream.prototype.skip = function (bytes) {
	this._index += bytes;
};

Stream.prototype.seek = function (index) {
	this._index = index;
};

Stream.prototype.tell = function () {
	return this._index;
};

Stream.prototype.remaining = function () {
	return this._data - this._index;
};

module.exports = Stream;
