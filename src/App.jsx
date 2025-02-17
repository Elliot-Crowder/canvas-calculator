import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./cartesianStyles.css";
import { mapYCoordToPx, mapXCoordToPx, mapPointToPixels } from "./utils/draw";

function App() {
	const [xmin, setxmin] = useState("-10");
	const [xmax, setxmax] = useState("+10");
	const [ymin, setymin] = useState("-10");
	const [ymax, setymax] = useState("+10");
	function handleXmin(event) {
		setxmin(event.target.value);
	}

	function handleXmax(event) {
		setxmax(event.target.value);
	}

	function handleYmin(event) {
		setymin(event.target.value);
	}

	function handleYmax(event) {
		setymax(event.target.value);
	}
	return (
		<div>
			<GraphWindowInputFields
				xmin={xmin}
				xmax={xmax}
				ymin={ymin}
				ymax={ymax}
				handleXmin={handleXmin}
				handleXmax={handleXmax}
				handleYmin={handleYmin}
				handleYmax={handleYmax}
			/>
			<CartesianGrid xmin={xmin} xmax={xmax} ymin={ymin} ymax={ymax} />
		</div>
	);
}

function CartesianGrid({ xmin, xmax, ymin, ymax }) {
	const graphWidth = 500;
	const graphHeight = 300;
	const canvasRef = useRef();

	function handleMouseMove(event) {
		// console.log(event.nativeEvent.offsetX);
		// console.log(event.nativeEvent.offsetY);
		const offsetX = event.nativeEvent.offsetX;
		const offsetY = event.nativeEvent.offsetY;
		const cursorCoord = {
			x: offsetX,
			y: offsetY,
		};
		// console.log(cursorCoord);
	}
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
	function drawGridLine(coord1, coord2) {
		const canvas = canvasRef.current;
		const draw = canvas.getContext("2d");
		draw.strokeStyle = "grey";
		draw.beginPath();
		draw.moveTo(coord1.x, coord1.y);
		draw.lineTo(coord2.x, coord2.y);
		draw.stroke();
		draw.font = "50px Arial";
		draw.fillText("Hello World", coord1.x, coord1.y);
		console.log(coord1);
		console.log(coord2);
	}
	function drawAxes(xmin, xmax, ymin, ymax, canvasHeight, canvasWidth) {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.strokeStyle - "black";

		//get origin points in pixel form
		const pxPoint = mapPointToPixels(
			{ x: 0, y: 0 },
			ymin,
			ymax,
			xmin,
			xmax,
			canvasHeight,
			canvasWidth
		);

		//draw x axis
		ctx.beginPath();
		ctx.moveTo(0, pxPoint.y);
		ctx.lineTo(canvasWidth, pxPoint.y);

		//draw y axis
		ctx.moveTo(pxPoint.x, 0);
		ctx.lineTo(pxPoint.x, canvasHeight);
		ctx.stroke();
	}
	function drawGrid(winHeight, winWidth) {
		for (let i = 0; i < winWidth; i += 20) {
			const coord1 = { x: i, y: 0 };
			const coord2 = { x: i, y: winHeight };
			drawGridLine(coord1, coord2);
		}
		for (let i = 0; i < winHeight; i += 20) {
			const coord1 = { x: 0, y: i };
			const coord2 = { x: winWidth, y: i };
			drawGridLine(coord1, coord2);
		}
	}
	useEffect(() => {
		const canvas = canvasRef.current;
		const draw = canvas.getContext("2d");
		draw.lineCap = "round";
		draw.fillStyle = "black";
		draw.font = "18px";
		// drawGridLine({ x: 10, y: 0 }, { x: 50, y: 50 });
		// drawGrid(graphHeight, graphWidth);
		drawAxes(xmin, xmax, ymin, ymax, graphHeight, graphWidth);
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
				onMouseMove={handleMouseMove}
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

	useEffect(() => {
		setTimeout(() => {
			console.log("banana");
		}, 800);
	}, []);

	return (
		<div>
			<div>
				<input
					type="text"
					placeholder="x-min"
					value={xmin}
					onChange={handleXmin}
				/>
			</div>
			<div>
				<input
					type="text"
					placeholder="x-max"
					value={xmax}
					onChange={handleXmax}
				/>
			</div>
			<div>
				<button onClick={logXRange}>log x range</button>
			</div>
			<div>
				<input
					type="text"
					placeholder="y-min"
					onChange={handleYmin}
					value={ymin}
				/>
			</div>
			<div>
				<input
					type="text"
					placeholder="y-max"
					onChange={handleYmax}
					value={ymax}
				/>
			</div>
			<div>
				<button onClick={logYRange}>log y range</button>
			</div>
		</div>
	);
}
export default App;
