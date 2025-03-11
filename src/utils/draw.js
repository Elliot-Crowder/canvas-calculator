import { evaluateExpression } from "./parsing/functionParse.js";
//x is the x coordinate we want to map into the pixel space
//xMin is the minimum x value/range of x values, and xMax is the domain of
//the function
//ths should be in draw, other functons need to be moved to another util file
export function plotFunction(points, winWidth, winHeight, ctx) {
	if (points.length === 0) {
		return;
	}
	ctx.beginPath();
	const sortedPoints = points.sort((a, b) => a.xPxCoord - b.xPxCoord);

	let isPrevOutOfBounds = false; //flag for discontinuous points

	ctx.moveTo(sortedPoints[0].xPxCoord, sortedPoints[0].yPxCoord);
	for (const point of sortedPoints) {
		if (point.yPxCoord < 0 || point.yPxCoord > winHeight) {
			isPrevOutOfBounds = true;
			continue;
		} else {
			if (isPrevOutOfBounds) {
				ctx.moveTo(point.xPxCoord, point.yPxCoord);
				isPrevOutOfBounds = false;
			} else {
				ctx.lineTo(point.xPxCoord, point.yPxCoord);
			}
		}
	}
	ctx.stroke();
}
export function generatePoints(expr, xmax, xmin, ymax, ymin, res = 0.01) {
	if (!expr) {
		return [];
	}

	const maxPoints = 500;
	// res = (xmax - xmin) / 200;
	res = Math.max(res, (xmax - xmin) / maxPoints);
	let points = new Set([]);
	// let prevInBounds = false;
	// let prevPoint = null;

	for (let x = xmin; x <= xmax; x += res) {
		let y = evaluateExpression(expr, "x", x).y;
		// let inBounds = y >= ymin && y <= ymax;

		// if (inBounds) {
		// 	if (prevInBounds && prevPoint) {
		// 		continue;
		// 	}
		// }
		// if (y >= ymin && y <= ymax) {
		// Ensure y is within bounds
		points.add({ x, y });
		// }
	}
	return points;
}

export function drawAxes(
	ctx,
	xmin,
	xmax,
	ymin,
	ymax,
	canvasHeight,
	canvasWidth
) {
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1.5;

	//get origin points in pixel form
	const pxPoint = mapPointToPixels(
		{ x: 0, y: 0 },
		parseInt(ymin),
		parseInt(ymax),
		parseInt(xmin),
		parseInt(xmax),
		canvasHeight,
		canvasWidth
	);
	const xOrigin = pxPoint.xPxCoord;
	const yOrigin = pxPoint.yPxCoord;
	//draw x axis
	ctx.beginPath();
	ctx.moveTo(0, yOrigin);
	ctx.lineTo(canvasWidth, yOrigin);

	//draw y axis
	ctx.moveTo(xOrigin, 0);
	ctx.lineTo(xOrigin, canvasHeight);
	ctx.stroke();
}

export function drawGrid(winHeight, winWidth) {
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

function drawGridLine(coord1, coord2, draw) {
	draw.strokeStyle = "grey";
	draw.beginPath();
	draw.moveTo(coord1.x, coord1.y);
	draw.lineTo(coord2.x, coord2.y);
	draw.stroke();
	draw.font = "50px Arial";
	// draw.fillText("Hello World", coord1.x, coord1.y);
}
export function mapXCoordToPx(x, xMin, xMax, canvasWidth) {
	const xPx = ((x - xMin) / (xMax - xMin)) * canvasWidth;
	return Math.trunc(xPx);
}

export function mapYCoordToPx(y, yMin, yMax, canvasHeight) {
	const yPx = canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
	return Math.trunc(yPx);
}

export function mapPointToPixels(
	point,
	yMin,
	yMax,
	xMin,
	xMax,
	canvasHeight,
	canvasWidth
) {
	const yPxCoord = mapYCoordToPx(point.y, yMin, yMax, canvasHeight);
	const xPxCoord = mapXCoordToPx(point.x, xMin, xMax, canvasWidth);
	const pxPoint = {
		yPxCoord,
		xPxCoord,
	};
	return pxPoint;
}

export function mapPointsToPixels(
	points,
	xMin,
	xMax,
	yMin,
	yMax,
	canvasHeight,
	canvasWidth
) {
	return points.map((point) => {
		return mapPointToPixels(
			point,
			yMin,
			yMax,
			xMin,
			xMax,
			canvasHeight,
			canvasWidth
		);
	});
}

//tests
let x = 0;
let xMin = -10;
let xMax = 10;
let canvasWidth = 500;

let y = 0;
let yMin = -10;
let yMax = 10;
let canvasHeight = 500;

console.log(mapXCoordToPx(x, xMin, xMax, canvasWidth));
console.log(mapYCoordToPx(y, yMin, yMax, canvasHeight));

x = 0;
xMax = 10;
xMin = 0;

y = 0;
yMax = 10;
yMin = -10;

console.log(mapXCoordToPx(x, xMin, xMax, canvasWidth));
console.log(mapYCoordToPx(y, yMin, yMax, canvasHeight));

const point = {
	x: 5,
	y: 5,
};

console.log(
	mapPointToPixels(point, yMin, yMax, xMin, xMax, canvasHeight, canvasWidth)
);

const points = generatePoints("x^2", 10, -10, 10, -10);
console.log("points:");
console.log(points);
