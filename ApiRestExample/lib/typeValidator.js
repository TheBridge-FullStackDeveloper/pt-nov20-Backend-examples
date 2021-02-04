function isString(variable) {
	return typeof variable === "string";
}

function isDate(variable) {
	return variable instanceof Date;
}

function isNumber(variable) {
	return typeof variable === "number";
}

module.exports = {
	isString, isDate, isNumber
};