import { useEffect, useRef, useState } from "react";
import * as math from "mathjs";
import "./App.css";
import "./cartesianStyles.css";
import { drawAxes, plotFunction } from "./utils/draw";
import { generatePoints } from "./utils/pointMap";

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
		setXmin(inputXmin);
		setXmax(inputXmax);
		setYmin(inputYmin);
		setYmax(inputYmax);
		setError(false);
		setErrorMessage("");
	}, [inputXmax, inputXmin, inputYmax, inputYmin]);
	const canvasScaleFactor = 4;
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || error) return;
		const ctx = canvas.getContext("2d");

		//set internal canvas resolution higher than displayed size
		canvas.width = 500 * canvasScaleFactor;
		canvas.height = 300 * canvasScaleFactor;

		canvas.style.width = "400px";
		canvas.style.height = "300px";
		ctx.scale(canvasScaleFactor, canvasScaleFactor);
		// Clear before redrawing
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const baseWindowWidth = canvas.width / canvasScaleFactor;
		const baseWindowHeight = canvas.height / canvasScaleFactor;

		console.log(canvas.height);
		const points = generatePoints(
			expr,
			Number(xmax),
			Number(xmin),
			Number(ymax),
			Number(ymin),
			baseWindowWidth,
			baseWindowHeight
		);
		drawAxes(ctx, xmin, xmax, ymin, ymax, baseWindowWidth, baseWindowHeight); //draw axes
		console.log("points:", points);
		plotFunction(points, baseWindowWidth, baseWindowHeight, ctx); //plot function on graph
	}, [xmin, xmax, ymin, ymax, expr]);
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
				setXmax={setXmax}
				setXmin={setXmin}
				setYmax={setYmax}
				setYmin={setYmin}
				canvasRef={canvasRef}
			/>
		</div>
	);
}

function CartesianGrid({
	xmin,
	xmax,
	ymin,
	ymax,
	setXmin,
	setXmax,
	setYmin,
	setYmax,
	canvasRef,
}) {
	const graphWidth = 500;
	const graphHeight = 300;

	const [mouseDown, setMouseDown] = useState(false);
	const [isPanning, setIsPanning] = useState(false);
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });

	function handleMouseUp() {
		setMouseDown(false);
		setIsPanning(false);
		console.log("release");
	}

	function handleMouseDown(e) {
		setIsPanning(true);
		setMouseDown(true);
		setStartPos({ x: e.clientX, y: e.clientY });
		console.log("down");
	}

	function handleMouseOver() {
		console.log("mouse in");
	}

	function handleMouseOut() {
		setIsPanning(false);
		setMouseDown(false);
		console.log("mouse out");
	}
	// const preventDefaultBehavior = (e) => {
	// 	e.preventDefault();
	// };

	const sensitivity = 0.05;
	function handleMouseMove(e) {
		if (!isPanning) {
			//if the user is not panning, ie the m1 is not down or the mouse is outside the canvas, we return
			return;
		}

		const deltaX = e.clientX - startPos.x;
		const deltaY = e.clientY - startPos.y;
		console.log(deltaX, deltaY);

		const newXMin = xmin - deltaX * sensitivity;
		const newXMax = xmax - deltaX * sensitivity;
		const newYMin = ymin + deltaY * sensitivity; //FIX VERTICAL PANNING
		const newYMax = ymax + deltaY * sensitivity;

		setXmin(newXMin);
		setXmax(newXMax);
		setYmin(newYMin);
		setYmax(newYMax);
		setStartPos({ x: e.clientX, y: e.clientY });
		// preventDefaultBehavior(e);
	}

	//Use effect called on page load to generate the graph axes
	useEffect(() => {
		const canvas = canvasRef.current;
		const draw = canvas.getContext("2d");
		const dpr = window.devicePixelRatio;
		const rect = {
			width: 500,
			height: 300,
		};
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		draw.scale(dpr, dpr);
		draw.lineCap = "round";
		draw.fillStyle = "black";
		draw.font = "18px";
		drawAxes(draw, xmin, xmax, ymin, ymax, rect.height, rect.width);
	}, []);
	return (
		<div>
			<div>{/* <pre>{JSON.stringify([xmin, xmax, ymin, ymax])}</pre> */}</div>
			<canvas
				width={graphWidth + "px"}
				height={graphHeight + "px"}
				className="cartesian-canvas"
				ref={canvasRef}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				onMouseMove={handleMouseMove}
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

	function handleKeyDown(event) {
		console.log(event.key);
		if (event.key === "Enter") {
			alert("Enter key press");
		}
	}

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
			</div>
		</div>
	);
}
export default App;
