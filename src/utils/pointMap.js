import { evaluateExpression } from "./parsing/functionParse.js";
export function generatePoints(
	expr,
	xmax,
	xmin,
	ymax,
	ymin,
	canvasWidth,
	canvasHeight
) {
	if (!expr) {
		return []; //if there is no expression there are no points to plot
	}
	const jumpThreshold = canvasHeight * 0.95; //the maximum distance between two points
	const domain = xmax - xmin;

	const numPoints = 1000; // The Number of points to plot
	const step = domain / numPoints; //The horizontal step distance between each pair of plotted points

	let points = [];
	let lastYPx = null;
	let lastY = null;

	for (let i = xmin; i <= xmax; i += step) {
		let y = evaluateExpression(expr, "x", i).y; //the cartesian y coordinate
		let realPoint = { x: i, y: y }; //the real cartesian coordinates
		let pxCoords = mapPointToPixels(
			realPoint,
			xmin,
			xmax,
			ymin,
			ymax,
			canvasHeight,
			canvasWidth
		); //cartesian coordinates mapped into the pixel space

		const yPxCoord = pxCoords.yPxCoord;
		const xPxCoord = pxCoords.xPxCoord;

		const jumpIsCrossingWindow =
			(lastYPx < 0 && yPxCoord > canvasHeight) ||
			(lastYPx > canvasHeight && yPxCoord < 0);

		//use the fact that if both points where the jump is are above the y limit/window pixels, then its not a jump and if theyre both below, its also not a jump
		if (lastY !== null && lastYPx !== null && isFinite(y)) {
			const jump = Math.abs(yPxCoord - lastYPx);
			if (jump > jumpThreshold && jumpIsCrossingWindow) {
				points.push({ xPxCoord, yPxCoord: null });
			}
		}

		lastY = y;
		lastYPx = yPxCoord;
		points.push({ xPxCoord, yPxCoord });
	}
	return points;
}

//POINT MAPPING FUNCTIONS
export function mapXCoordToPx(x, xMin, xMax, canvasWidth) {
	const xPx = ((x - xMin) / (xMax - xMin)) * canvasWidth;
	//   return Math.trunc(xPx);
	return xPx;
}

export function mapYCoordToPx(y, yMin, yMax, canvasHeight) {
	const yPx = canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
	//   return Math.trunc(yPx);
	return yPx;
}

export function mapPointToPixels(
	point,
	xMin,
	xMax,
	yMin,
	yMax,
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
// let x = 0;
// let xMin = -10;
// let xMax = 10;
// let canvasWidth = 500;

// let y = 0;
// let yMin = -10;
// let yMax = 10;
// let canvasHeight = 500;

// console.log(mapXCoordToPx(x, xMin, xMax, canvasWidth));
// console.log(mapYCoordToPx(y, yMin, yMax, canvasHeight));

// x = 0;
// xMax = 10;
// xMin = 0;

// y = 0;
// yMax = 10;
// yMin = -10;

// console.log(mapXCoordToPx(x, xMin, xMax, canvasWidth));
// console.log(mapYCoordToPx(y, yMin, yMax, canvasHeight));

// const point = {
//   x: 5,
//   y: 5,
// };

// console.log(
//   mapPointToPixels(point, yMin, yMax, xMin, xMax, canvasHeight, canvasWidth)
// );

// const points = generatePoints("x^2", 10, -10, 10, -10);
// console.log("points:");
// console.log(points);
