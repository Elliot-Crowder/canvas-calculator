//x is the x coordinate we want to map into the pixel space
//xMin is the minimum x value/range of x values, and xMax is the domain of
//the function
export function mapXCoordToPx(x, xMin, xMax, canvasWidth) {
	const xPx = ((x - xMin) / (xMax - xMin)) * canvasWidth;
	return xPx;
}

export function mapYCoordToPx(y, yMin, yMax, canvasHeight) {
	const yPx = canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
	return yPx;
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
