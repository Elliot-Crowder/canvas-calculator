import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./cartesianStyles.css";
import { mapYCoordToPx, mapXCoordToPx, mapPointToPixels } from "./utils/draw";

function drawAxes(ctx, xmin, xmax, ymin, ymax, canvasHeight, canvasWidth) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1.5;

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

function App() {
  const [xmin, setxmin] = useState("-10");
  const [xmax, setxmax] = useState("+10");
  const [ymin, setymin] = useState("-10");
  const [ymax, setymax] = useState("+10");

  const canvasRef = useRef();

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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before redrawing
    drawAxes(ctx, xmin, xmax, ymin, ymax, 300, 500);
  }, [xmin, xmax, ymin, ymax]); // Now updates when state changes
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
      <CartesianGrid
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
    // draw.fillText("Hello World", coord1.x, coord1.y);
    console.log(coord1);
    console.log(coord2);
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

  function handleMouseOver(event) {
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
    // drawGridLine({ x: 10, y: 0 }, { x: 50, y: 50 });
    // drawGrid(graphHeight, graphWidth);
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
        onMouseMove={handleMouseMove}
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
