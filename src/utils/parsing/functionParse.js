//use math.js library?
// function parseFunction(function){
//     return;
// }
import { parse, evaluate } from "mathjs";
export const DEFINED_FUNCTIONS = new Set([
	"sin",
	"cos",
	"tan",
	"log",
	"exp",
	"sqrt",
	"abs",
	"pow",
	"floor",
	"ceil",
]);

function cleanExpression(expression) {
	if (expression.includes("=")) {
		return expression.split("=")[1];
	} else {
		return expression;
	}
}

export function extractVariables(expression) {
	//extracts variables from mathematic expressions
	let rhs = expression;
	rhs = cleanExpression(expression);
	const matches = rhs.match(/[a-zA-Z_]+/g);
	return [...new Set(matches.filter((v) => !DEFINED_FUNCTIONS.has(v)))]; //only include varaibles that are not apart of predfined function
}

export function evaluateExpression(expression, variable, value) {
	const rawExpression = cleanExpression(expression);
	const parsedExpression = parse(rawExpression);

	const xyPair = {
		x: value,
		y: parsedExpression.evaluate({ [variable]: value }),
	};
	return xyPair;
}
