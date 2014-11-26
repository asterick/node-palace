var ips = require("./iptscrae"),
	fs = require("fs");

var out = ips.Parser.parse(fs.readFileSync("./test/BeachResort/beachresort.pat", 'utf-8'));
console.log(JSON.stringify(out, null, 4));
