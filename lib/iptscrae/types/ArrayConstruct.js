var Types = require("./index"),
	FlowControl = require("../flowcontrol"),
	ExecutionError = require("../error");

function IptArrayConstruct (contents) {
	this._contents = contents;
}

Types.Base.extend(IptArrayConstruct);

IptArrayConstruct.prototype.reference = function (context) {
	var contents = [],
		subcontext = Object.create(context, { stack: { value: contents } });

	this._contents.forEach(function (elem) {
		elem.reference(subcontext);
	});

	context.stack.push(new Types.Array(contents));
};

IptArrayConstruct.prototype.toString = function () {
	return "[ " + this._contents.map(function (i) { return i.toString(); }).join(" ") + " ]";
};

module.exports = IptArrayConstruct;
