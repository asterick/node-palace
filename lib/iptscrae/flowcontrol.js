// These are flow control statements that are trapped at
// various points in the call flow

module.exports = {
	Return: new Error("Untrapped RETURN statement"),
	Break: new Error("Untrapped BREAK statement"),
	Exit: new Error("Untrapped EXIT statement")
};
