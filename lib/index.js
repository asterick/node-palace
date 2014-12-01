var Iptscrae = require("./iptscrae");

var runtime = new Iptscrae.Runtime(),
	evt = Iptscrae.parse("ON EVENT { [ 1 2 + ] }"),
	scr = evt[0].script;

runtime.execute(scr);
