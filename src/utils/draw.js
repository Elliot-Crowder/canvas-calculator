import { mapPointToPixels } from "./pointMap.js";

export function plotFunction(points, winWidth, winHeight, ctx) {
	if (points.length === 0) {
		return;
	}
	ctx.beginPath();
	ctx.moveTo(points[0].xPxCoord, points[0].yPxCoord);

	let lastPointAsymptote = false;
	for (let i = 0; i < points.length; i++) {
		const point = points[i];

		if (point.yPxCoord === null) {
			lastPointAsymptote = true;
			continue;
		}

		if (lastPointAsymptote) {
			ctx.moveTo(point.xPxCoord, point.yPxCoord);
			lastPointAsymptote = false;
		} else {
			ctx.lineTo(point.xPxCoord, point.yPxCoord);
		}
	}
	ctx.stroke();
}

export function drawAxes(
	ctx,
	xmin,
	xmax,
	ymin,
	ymax,
	canvasWidth,
	canvasHeight
) {
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1.75;

	//get origin points in pixel form
	const pxPoint = mapPointToPixels(
		{ x: 0, y: 0 },
		Number(xmin),
		Number(xmax),
		Number(ymin),
		Number(ymax),
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
