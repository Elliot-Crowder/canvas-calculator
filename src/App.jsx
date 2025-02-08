import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./cartesianStyles.css";

function App() {
  return (
    <div>
      <GraphWindowInputFields />
      <CartesianGrid />
    </div>
  );
}

function CartesianGrid() {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const draw = canvas.getContext("2d");
    draw.lineCap = "round";
    draw.fillStyle = "black";
    draw.font = "18px";
  }, []);
  return (
    <div>
      <canvas
        width="500px"
        height="500px"
        className="cartesian-canvas"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
}

function GraphWindowInputFields() {
  const [xmin, setxmin] = useState("-10");
  const [xmax, setxmax] = useState("+10");
  const yMinRef = useRef();
  const yMaxRef = useRef();
  function handleXmin(event) {
    setxmin(event.target.value);
  }

  function handleXmax(event) {
    setxmax(event.target.value);
  }

  function logXRange() {
    const xRange = {
      xmin: xmin,
      xmax: xmax,
    };
    console.log(xRange);
  }

  function logYRange() {
    const yRange = {
      ymin: yMinRef.current.value,
      ymax: yMaxRef.current.value,
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
        <input type="text" placeholder="y-min" ref={yMinRef} />
      </div>
      <div>
        <input type="text" placeholder="y-max" ref={yMaxRef} />
      </div>
      <div>
        <button onClick={logYRange}>log y range</button>
      </div>
    </div>
  );
}
export default App;
