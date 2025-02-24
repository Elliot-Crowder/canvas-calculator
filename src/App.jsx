import { useEffect, useRef, useState } from "react";
import * as math from "mathjs";
import "./App.css";
import "./cartesianStyles.css";
import {
	drawAxes,
	plotFunction,
	generatePoints,
	mapPointsToPixels,
} from "./utils/draw";
// function isValidExpression(expression) {
// 	const variablePattern = /(?:^|[^a-zA-Z])[a-wyz](?:$|[^a-zA-Z])/i;

// 	// Regular expression to match invalid function usage:
// 	// 1. Partial function names like 'ta', 'co', 'cos' without a following '('
// 	// 2. Full function names like 'tan', 'sin', 'cos' without a following '('
// 	const functionPattern = /(tan|sin|cos|ta|co|si)(?!\s*\()/i;

// 	// Check for invalid standalone variables (anything other than 'x')
// 	if (variablePattern.test(expression)) {
// 		return false;
// 	}

// 	// Check for invalid function usage (partial or full function names without a following '(')
// 	if (functionPattern.test(expression)) {
// 		return false;
// 	}

// 	// If all checks pass, the expression is valid
// 	return true;
// }

function isValidExpression(expression) {
	try {
		math.evaluate(expression, { x: 1 });
		return true;
	} catch (err) {
		return false;
	}
}
function App() {
	const [inputXmin, setInputXmin] = useState("-10");
	const [inputXmax, setInputXmax] = useState("+10");
	const [inputYmin, setInputYmin] = useState("-10");
	const [inputYmax, setInputYmax] = useState("+10");

	const [xmin, setXmin] = useState("-10");
	const [xmax, setXmax] = useState("+10");
	const [ymin, setYmin] = useState("-10");
	const [ymax, setYmax] = useState("+10");

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [inputExpr, setInputExpr] = useState("");
	const [expr, setExpr] = useState("");

	const canvasRef = useRef();

	function handleInputExpression(event) {
		const expression = event.target.value;

		setInputExpr(expression);
	}
	function handleXmin(event) {
		setInputXmin(event.target.value);
	}

	function handleXmax(event) {
		setInputXmax(event.target.value);
	}

	function handleYmin(event) {
		setInputYmin(event.target.value);
	}

	function handleYmax(event) {
		setInputYmax(event.target.value);
	}
	useEffect(() => {
		if (!inputExpr) {
			setError(true);
			setErrorMessage("empty expression field");
			return;
		}
		if (!isValidExpression(inputExpr)) {
			setError(true);
			setErrorMessage("Invalid Expression");
			return;
		}
		try {
			math.compile(inputExpr);
			setError(false);
			setExpr(inputExpr);
			setErrorMessage("");
		} catch (err) {
			setErrorMessage("invalid expr");
			setError(true);
		}
	}, [inputExpr]);
	useEffect(() => {
		if (!inputXmin || !inputXmax || !inputYmin || !inputYmax) {
			setError(true);
			setErrorMessage("at least one field left empty");
			return;
		}
		if (
			isNaN(Number(inputXmin)) ||
			isNaN(Number(inputXmax)) ||
			isNaN(Number(inputYmin)) ||
			isNaN(Number(inputYmax))
		) {
			setError(true);
			setErrorMessage("no number");
			return;
		}
		if (Number(inputXmin) > Number(inputXmax)) {
			setError(true);
			setErrorMessage("xmin > xmax");
			return;
		}
		if (Number(inputYmin) > Number(inputYmax)) {
			setError(true);
			setErrorMessage("ymin > ymax");
			return;
		}
		console.log("pizza");
		setXmin(inputXmin);
		setXmax(inputXmax);
		setYmin(inputYmin);
		setYmax(inputYmax);
		setError(false);
		setErrorMessage("");
	}, [inputXmax, inputXmin, inputYmax, inputYmin]);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || error) return;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before redrawing
		console.log(typeof xmin);
		drawAxes(ctx, xmin, xmax, ymin, ymax, 300, 500);
		//move function plotting somewhere else once input is set up
		const points = Array.from(
			generatePoints(
				expr,
				parseInt(xmax), //change these to Number(parseInt)?
				parseInt(xmin),
				parseInt(ymax),
				parseInt(ymin)
			)
		);
		console.log(points);
		const pixelPoints = mapPointsToPixels(
			points,
			xmin,
			xmax,
			ymin,
			ymax,
			300,
			500
		);
		console.log("pixpoints:", pixelPoints);
		plotFunction(pixelPoints, 500, 300, ctx);
	}, [xmin, xmax, ymin, ymax, expr]); // Now updates when state changes
	return (
		<div>
			<input type="text" value={inputExpr} onChange={handleInputExpression} />
			<GraphWindowInputFields
				xmin={inputXmin}
				xmax={inputXmax}
				ymin={inputYmin}
				ymax={inputYmax}
				handleXmin={handleXmin}
				handleXmax={handleXmax}
				handleYmin={handleYmin}
				handleYmax={handleYmax}
			/>
			<div>{errorMessage}</div>
			<div>{JSON.stringify(error)}</div>
			<CartesianGrid
				expr={expr}
				xmin={xmin}
				xmax={xmax}
				ymin={ymin}
				ymax={ymax}
				canvasRef={canvasRef}
			/>
		</div>
	);
}

function CartesianGrid({ xmin, xmax, ymin, ymax, canvasRef }) {
	const graphWidth = 500;
	const graphHeight = 300;

	function handleClick(event) {
		const canvas = canvasRef.current;
		const draw = canvas.getContext("2d");
		const offsetX = event.nativeEvent.offsetX;
		const offsetY = event.nativeEvent.offsetY;
		const cursorCoord = {
			x: offsetX,
			y: offsetY,
		};
		// console.log(cursorCoord);
		draw.beginPath();
		draw.arc(cursorCoord.x, cursorCoord.y, 40, 0, 2 * Math.PI);
		draw.fillStyle = "green";
		draw.fill();
	}

	function handleMouseOver() {
		const canvas = canvasRef.current;
		canvas.style.outline = "2px solid green";
	}

	function handleMouseOut() {
		const canvas = canvasRef.current;
		canvas.style.outline = "1px solid black";
	}
	useEffect(() => {
		const canvas = canvasRef.current;
		const draw = canvas.getContext("2d");
		draw.lineCap = "round";
		draw.fillStyle = "black";
		draw.font = "18px";
		drawAxes(draw, xmin, xmax, ymin, ymax, graphHeight, graphWidth);
	}, []);
	return (
		<div>
			<div>
				<pre>{JSON.stringify([xmin, xmax, ymin, ymax])}</pre>
			</div>
			<canvas
				width={graphWidth + "px"}
				height={graphHeight + "px"}
				className="cartesian-canvas"
				ref={canvasRef}
				// onMouseMove={handleMouseMove}
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				onClick={handleClick}
			/>
		</div>
	);
}

function GraphWindowInputFields({
	xmin,
	xmax,
	ymin,
	ymax,
	handleYmax,
	handleYmin,
	handleXmin,
	handleXmax,
}) {
	// const yMinRef = useRef();
	// const yMaxRef = useRef();

	function logXRange() {
		const xRange = {
			xmin: xmin,
			xmax: xmax,
		};
		console.log(xRange);
	}

	function logYRange() {
		const yRange = {
			ymin: ymin,
			ymax: ymax,
		};
		console.dir(yRange);
	}

	function handleKeyDown(event) {
		console.log(event.key);
		if (event.key === "Enter") {
			alert("Enter key press");
		}
	}

	useEffect(() => {
		setTimeout(() => {
			console.log("banana");
		}, 800);
	}, []);

	return (
		<div>
			<div>
				<span className="input-field-container">
					<input
						type="text"
						placeholder="x-min"
						value={xmin}
						onChange={handleXmin}
						onKeyDown={handleKeyDown}
					/>
				</span>
				<span className="input-field-container">
					<input
						type="text"
						placeholder="x-max"
						value={xmax}
						onChange={handleXmax}
					/>
				</span>
				<button onClick={logXRange}>log x range</button>
			</div>
			<div>
				<span className="input-field-container">
					<input
						type="text"
						placeholder="y-min"
						onChange={handleYmin}
						value={ymin}
					/>
				</span>
				<span className="input-field-container">
					<input
						type="text"
						placeholder="y-max"
						onChange={handleYmax}
						value={ymax}
					/>
				</span>

				<button onClick={logYRange}>log y range</button>
			</div>
		</div>
	);
}
export default App;
