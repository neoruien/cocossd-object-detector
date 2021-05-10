import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(async () => {
    const net = await cocossd.load();
    setInterval(() => {detect(net)}, 10);
  });

  const detect = async (net) => {
    // Check if webcam video is available
    if (
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Configure dimensions
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      // Start detecting objects
      const obj = await net.detect(video);
      // Draw bounding box
      const ctx = canvasRef.current.getContext("2d");
      drawBbox(obj, ctx); 
    }
  };

  const drawBbox = (detections, ctx) =>{
    detections.forEach(prediction => {
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
      // Set styling
      const color = Math.floor(Math.random()*18000000).toString(16);
      ctx.strokeStyle = '#' + color;
      ctx.font = '20px Roboto';
      // Draw annotated bbox
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();
      ctx.fillStyle = '#' + color;
      ctx.fillText(text, x, y);
    });
  }

  return (
    <div className="container">
      <p style={{
        position: "absolute",
        top: "8%",
        fontSize: "3.5rem"
      }}>
        COCOSSD Object Detector
      </p>
      <p style={{
        position: "absolute",
        top: "18%",
        fontSize: "2rem"
      }}>
        with Facecam
      </p>
      <div className="display-frame">
        <Webcam ref={webcamRef} muted={true} />
      </div>
      <div className="display-frame">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default App;
