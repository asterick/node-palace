#!/bin/env node

// sudo SERVER=mansion.thepalace.com node ./tools/proxy.js

require("../index.js")

var net = require("net"),
	remote_host = process.env.SERVER || "palace.openpalace.net",
	remote_port = process.env.PORT || 9998,
	proxy_port = process.env.LISTEN || 9998;

var Stream = require("../lib/util/stream"),
	Defintions = require("../lib/net/definitions");

function dumpHex(array, span) {
	if (!array) { return ; }

	span || (span = 32);

	for (var start = 0; start < array.length; start += span) {
		var out = [], chrs = "";
		for (var i = start; i < array.length && i < start + span; i++) {
			var v = array[i],
				val = v.toString(16);

			if (val.length < 2) val = "0" + val;
			out.push(val);

			chrs += (v >= 0x20 && v <= 0x7F) ? String.fromCharCode(v) : ".";
		}

		while (out.length < span) out.push("  ");
		console.log(out.join(" "),chrs);
	}
}

function PacketStream(target, def) {
	this._target = target;
	this._buffer = new Uint8Array(0);
	this._definitions = new Defintions(def);
}

PacketStream.prototype.write = function (data) {
	var ab = new Uint8Array(this._buffer.length + data.length),
		start, i;

	for (i = 0; i < this._buffer.length; i++) {
		ab[i] = this._buffer[i];
	}

	for (start = i, i = 0; i < data.length; i++) {
		ab[i+this._buffer.length] = data[i];
	}

	this._buffer = ab;

	while(this.drain()) ;
}

PacketStream.prototype.drain = function () {
	// Incomplete header
	if (this._buffer.length < 12) { return false; }

	try {
		var stream = new Stream(this._buffer),
			packet = this._definitions.decode(stream);

		if (packet.body.type === "RawData") {
			console.log(this._target + ":", "unknown packet " + packet.tag + "(" + packet.target + ")");
			dumpHex(packet.body.data);
		} else {
			console.log(this._target + ":", JSON.stringify(packet,null,4));
		}

		this._buffer = new Uint8Array(this._buffer.buffer.slice(stream.tell()));

		return true;
	} catch (e) {
		console.log("OUT OF SYNC ERROR:", this._target);
		console.log(e.message);
		dumpHex(this._buffer);

		// Incomplete message (or bad definition)
		return false;
	}
}

var proxy = net.createServer(function (client) {
	function bind(stream, source, target) {
		source.on('data', function (data) {
			target.write(data);
			stream.write(data);
		});

		source.on('end', function (data) {
			target.end();
		});

		source.on('error', function (err) {
			console.log("Connection Error:", err);
			target.end();
			source.end();
		});
	}

	var addr = client.address();
	console.log("Connection received from", addr.family+"://"+addr.address+":"+addr.port);

	var server = net.connect(remote_port, remote_host, function () {
		console.log("Remote connection established")
	});

	bind(new PacketStream("server", require("../lib/net/patterns/server.def")), server, client);
	bind(new PacketStream("client", require("../lib/net/patterns/client.def")), client, server);
});

proxy.listen(proxy_port, function () {
	var addr = this.address();
	console.log("Listening on", addr.family+"://"+addr.address+":"+addr.port);
});


// Flash policy server for node.js
net.createServer(function (client) {
	client.on('data', function (data) {
		// Cheap hack to allow flash sockets to work without creating a policy server
		if ((new Buffer(data)).toString('utf-8') == "<policy-file-request/>\x00") {
			client.write('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>\x00');
			return ;
		}
	});
}).listen(843);
