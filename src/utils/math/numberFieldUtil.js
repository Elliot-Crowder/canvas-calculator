// function add(a, b) {
// 	return a + b;
// }

// function applyMultiplier(enclosedStr, startFragment) {
// 	const match = startFragment.match(/\d+$/);

// 	if (!match) {
// 		return [enclosedStr.slice(), startFragment.slice()];
// 	}

// 	if (match) {
// 		const multiplier = Number(match[0]);
// 		const multiplicand = Number(enclosedStr.slice());
// 		const product = multiplicand * multiplier;
// 		const length = multiplier.toString().length;

// 		return [product.toString(), startFragment.slice(0, -1 * length)];
// 	}
// }

// function applyOperator(enclosedStr, startFrag) {
// 	let startFragCopy = startFrag.slice();
// 	let enclosedCopy = enclosedStr.slice();
// 	const enclosureMatch = startFrag.slice(-1).match(/\[|\(/);
// 	const operatorMatch = startFrag.slice(-4).match(/(abs|cos|ln|sin|aqrt|tan)$/);

// 	const operator = operatorMatch ? operatorMatch[0] : null;
// 	const length = operator?.length || 0;
// 	let value = 0;

// 	if (enclosedStr.includes("°")) {
// 		value = degToRad(Number(enclosedStr.replace("°", "")));
// 	} else {
// 		value = Number(enclosedStr.slice());
// 	}

// 	console.log(value);

// 	if (enclosureMatch) {
// 		return [enclosedCopy, startFragCopy];
// 	}

// 	if (!operatorMatch) {
// 		return [enclosedCopy, startFragCopy];
// 	}

// 	startFragCopy = startFragCopy.slice(0, -1 * length);

// 	switch (operator) {
// 		case "abs": {
// 			value = Math.abs(value);
// 			break;
// 		}
// 		case "cos": {
// 			value = Math.cos(value);
// 			break;
// 		}
// 		case "ln": {
// 			value = Math.log(value);
// 			break;
// 		}
// 		case "sin": {
// 			value = Math.sin(value);
// 			break;
// 		}
// 		case "sqrt": {
// 			value = Math.sqrt(value);
// 			break;
// 		}
// 		case "tan": {
// 			value = Math.tan(value);
// 			break;
// 		}
// 		default:
// 			break;
// 	}

// 	return [value.toString(), startFragCopy.slice(0, -1 * length)];
// }

// function calcReciprocal(number) {
// 	if (number === 0) {
// 		console.log("the number is zero");
// 		return "undefined";
// 	}
// 	return 1 / number;
// }

// function degToRad(deg) {
// 	return deg * (Math.PI / 180);
// }

// function evaluate(str) {
// 	const maxRounds = 5;
// 	let expr = toTidiedForm(str);

// 	console.log("SIMPLIFYING: " + expr);

// 	for (let i = 1; i < maxRounds; i++) {
// 		const [maxDepth, maxDepthIndex] = calcMaxDepth(expr);

// 		console.log("=========================");
// 		console.log("ROUND " + i);
// 		console.log("enclosure depth: " + maxDepth);

// 		if (maxDepth === 0) {
// 			i = maxRounds;
// 			expr = simplifyExponents(expr);
// 			expr = simplifyProducts(expr);
// 			expr = simplifySums(expr);
// 			console.log("finished after round " + i);
// 			console.log(expr);
// 			return expr;
// 		}

// 		// handle contents of innermost parentheses or bracket pair
// 		if (maxDepth > 0) {
// 			let enclosedStr = "";
// 			let endIndex = 0;
// 			let endFragment = "";
// 			let startFragment = "";
// 			let startIndex = 0;

// 			[enclosedStr, startIndex, endIndex] = findEnclosed(expr, maxDepthIndex);

// 			console.log("enclosed expr: " + enclosedStr);
// 			startFragment = expr.slice(0, startIndex);
// 			endFragment = expr.slice(endIndex + 1);

// 			enclosedStr = simplifyExponents(enclosedStr);
// 			enclosedStr = simplifyProducts(enclosedStr);
// 			enclosedStr = simplifySums(enclosedStr);

// 			[enclosedStr, startFragment] = applyMultiplier(
// 				enclosedStr,
// 				startFragment
// 			);

// 			console.log(enclosedStr);

// 			[enclosedStr, startFragment] = applyOperator(enclosedStr, startFragment);

// 			expr = startFragment + enclosedStr + endFragment;
// 		}

// 		console.log(expr);
// 	}
// }

// function findMultiplier(str) {
// 	const match = str.match(/\d+$/);
// 	const multiplier = match ? Number(match[0]) : 1;

// 	return multiplier;
// }

// function matchSuperscript(str) {
// 	return str.match(/\^(–*\d+\.*\d*)\s*$/);
// }

// function simplifyExponents(str) {
// 	let strCopy = str.slice();
// 	const matches = strCopy.match(/(\d+\.*\d*)\^(-*\d+\.*\d*)/g);

// 	if (!matches) return strCopy;

// 	matches.forEach((item) => {
// 		const match = item.match(/(\d+\.*\d*)\^(-*\d+\.*\d*)/);
// 		const expr = match[0];
// 		const base = match[1];
// 		const exponent = match[2];
// 		const value = Math.pow(base, exponent);

// 		strCopy = strCopy.replace(expr, value);
// 	});

// 	console.log("simplifying exponents: " + strCopy);
// 	return strCopy;
// }

// function simplifyProducts(str) {
// 	let strCopy = str.slice();
// 	let divisors = [];
// 	let products = [];

// 	divisors = strCopy.match(/\/(\d+\.*\d*)/g);

// 	for (let i = 0; i < divisors?.length; i++) {
// 		const match = strCopy.match(/\/(\d+\.*\d*)/);
// 		const divisor = Number(match[1]);
// 		const reciprocal = calcReciprocal(divisor);

// 		if (reciprocal === "undefined") {
// 			strCopy = "undefined";
// 			return strCopy;
// 		}

// 		strCopy = strCopy.replace(match[0], "*" + reciprocal);
// 	}

// 	products = strCopy.match(/(\d+\.*\d*)\*/g);

// 	if (!products) {
// 		return strCopy;
// 	}

// 	for (let i = 0; i < products?.length; i++) {
// 		const match = strCopy.match(/(-*\d+\.*\d*)\*(-*\d+\.*\d*)/);
// 		const product = match[1] * match[2];
// 		strCopy = strCopy.replace(match[0], product);
// 	}

// 	console.log("simplifying products: " + strCopy);
// 	return strCopy;
// }

// function simplifySums(str) {
// 	let strCopy = str.slice();
// 	let terms = [];
// 	let sum = 0;
// 	strCopy = strCopy.replaceAll(/(?<!e)-/g, "+-"); // replace - with +-, except for scientific notation, e.g. 3e-8

// 	terms = strCopy.split("+").map((term) => Number(term));

// 	sum = terms.reduce((acc, cur) => acc + cur);

// 	return sum.toString();
// }

// function toTidiedForm(str) {
// 	let tidiedForm = str.slice();

// 	let matches = tidiedForm.match(/(\d+)\u00B0/g); // matches degree symbol
// 	console.log(matches);

// 	matches?.forEach((match) => {
// 		const degrees = Number(match.replace("°", ""));
// 		console.log(degrees);
// 		tidiedForm = tidiedForm.replace(match, degToRad(degrees));
// 	});

// 	tidiedForm = tidiedForm
// 		.replaceAll(" ", " ")
// 		.replaceAll("<sup>", "^")
// 		.replaceAll("</sup>", "")
// 		.replaceAll("–", "-")
// 		.replaceAll("×", "*")
// 		.replaceAll("π", "(3.14159)")
// 		.replaceAll(/\s+/g, "");

// 	return tidiedForm;
// }
