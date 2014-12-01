var types = {};
module.exports = types;

types.Base = require("./type");
types.Reference = require("./reference");
types.Number = require("./number");
types.String = require("./string");
types.AtomList = require("./atomlist");
types.Array = require("./array");
types.ArrayConstruct = require("./arrayconstruct");
types.Symbol = require("./symbol");
types.Function = require("./function");

