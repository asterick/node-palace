var Types = require("./index"),
	ExecutionError = require("../error");

function IptArray (value) {
	this._contents = value;
}

Types.Base.extend(IptArray);

IptArray.prototype.get = function (index) {
	if (!index.is(Types.Number)){
		throw new Error("Cannot index with non number value");
	}

	return this._contents[index.toNumber()];
};

IptArray.prototype.put = function (index, data) {
	if (!index.is(Types.Number)){
		throw new Error("Cannot index with non number value");
	}

	this._contents[index.toNumber] = data;
};

IptArray.prototype.forEach = function (funct, ctx) {
	this._contents.forEach(function (data) {
		funct.call(ctx, data);
	});
};

IptArray.prototype.length = function () {
	return this._contents.length;
};

IptArray.prototype.toString = function () {
	return "[ " + this._contents.map(function (i) { return i.toString(); }).join(" ") + " ]";
};

module.exports = IptArray;
