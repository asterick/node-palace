var Types = require("./index"),
	FlowControl = require("../flowcontrol"),
	ExecutionError = require("../error");

function IptAtomList (contents) {
	this._contents = contents;
}

Types.Base.extend(IptAtomList);

IptAtomList.prototype.execute = function (context) {
	try {
		this._contents.forEach(function (elem) {
			elem.reference(context);
		});
	} catch (e) {
		switch(e) {
		case FlowControl.Return:
			return ;
		default:
			throw e;
		}
	}
};

IptAtomList.prototype.toString = function () {
	return "{ " + this._contents.map(function (i) { return i.toString(); }).join(" ") + " }";
};

module.exports = IptAtomList;
