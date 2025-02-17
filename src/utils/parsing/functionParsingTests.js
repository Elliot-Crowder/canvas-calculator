import { extractVariables, evaluateExpression } from "./functionParse.js";
const expression1 = "f(x)=x^2";
const expression2 = "m^2";

const var1 = extractVariables(expression1);
const var2 = extractVariables(expression2);
console.log(var1);
console.log(var2);
const answer1 = evaluateExpression(expression1, "x", 2);
console.log(answer1);

const expression3 = "sin(x) * cos(x) + 3*x^2 - 4*x + 5";
const var3 = extractVariables(expression3);
const answer3 = evaluateExpression(expression3, var3[0], 3);
console.log(answer3);
