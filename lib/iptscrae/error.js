function ExecutionError() {
    var tmp = Error.apply(this, arguments);
    tmp.name = this.name = 'ExecutionError';

    this.stack = tmp.stack;
    this.message = tmp.message;

    return this;
}
var IntermediateInheritor = function() {};
IntermediateInheritor.prototype = Error.prototype;

ExecutionError.prototype = new IntermediateInheritor();

module.exports = ExecutionError;
