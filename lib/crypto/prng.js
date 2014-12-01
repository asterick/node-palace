/**
 ** This is a TERRIBLE random number generator, and is not
 ** cryptographically sound.  Do not use for anything other
 ** than the palace message decoding
 **/

var RANDOM_MAGIC = 0x1f31d;

function Random(seed) {
	this.seed(seed);
}

Random.prototype.seed = function (seed) {
	this.feedback = seed || 1;
};

Random.prototype.next = function () {
	var q = Math.floor(this.feedback / RANDOM_MAGIC),
		r = this.feedback % RANDOM_MAGIC,
		a = 16807 * r - 2836 * q;

	if (a < 0) { a += 0x7fffffff; }

	return (this.feedback = a) >> 23;
};

module.exports = Random;
