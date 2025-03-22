import { mapPointToPixels } from "./pointMap.js";

export function plotFunction(points, winWidth, winHeight, ctx) {
  if (points.length === 0) {
    return;
  }
  ctx.beginPath();
  const path = new Path2D();
  const sortedPoints = points.sort((a, b) => a.xPxCoord - b.xPxCoord);

  let isPrevOutOfBounds = false; //flag for discontinuous points

  ctx.moveTo(sortedPoints[0].xPxCoord, sortedPoints[0].yPxCoord);
  for (const point of sortedPoints) {
    if (point.yPxCoord < 0 || point.yPxCoord > winHeight) {
      isPrevOutOfBounds = true;
      continue;
    } else {
      if (isPrevOutOfBounds) {
        // ctx.moveTo(point.xPxCoord, point.yPxCoord);
        path.moveTo(point.xPxCoord, point.yPxCoord);
        isPrevOutOfBounds = false;
      } else {
        // ctx.lineTo(point.xPxCoord, point.yPxCoord);
        path.lineTo(point.xPxCoord, point.yPxCoord);
      }
    }
  }

  ctx.stroke(path);
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
    parseInt(xmin),
    parseInt(xmax),
    parseInt(ymin),
    parseInt(ymax),
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

//
//
//
//
//
//
//
//
//
//
