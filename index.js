#!/bin/env node

/**
 ** This is only here to provide the shim elements for the file as a node.js executable
 **/

var pegjs = require("pegjs"),
	fs = require("fs");

require.extensions['.pegjs'] =
	function (module, filename) {
		module.exports = pegjs.buildParser(fs.readFileSync(filename, 'utf8'), { cache: true });
	}

module.exports = require("./lib");
