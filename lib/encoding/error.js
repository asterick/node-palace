function EncodingError() {
    var tmp = Error.apply(this, arguments);
    tmp.name = this.name = 'EncodingError';

    this.stack = tmp.stack;
    this.message = tmp.message;

    return this;
}

var IntermediateInheritor = function() {};
IntermediateInheritor.prototype = Error.prototype;

EncodingError.prototype = new IntermediateInheritor();

module.exports = EncodingError;
