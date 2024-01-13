import { Point } from "../../types/types";

import { LM as LANDMARKS } from "./constants";

import * as poseDetection from "@tensorflow-models/pose-detection";


const HEAD_TILT = "Head Tilt";
const SHOULDER_TILT = "Shoulder Tilt";
const PELVIC_TILT = "Pelvic Tilt";
const KNEE_TILT = "Knee Tilt";

function findAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  }
  
  const getMidPoint = (p1: Point, p2: Point): Point => {
    const midPointX = (p1.x + p2.x) / 2;
    const midPointY = (p1.y + p2.y) / 2;
    const midPoint = { x: midPointX, y: midPointY };
    return midPoint;
  };

  function getHeadTiltSnip(keypoints: poseDetection.Keypoint[], canvas: HTMLCanvasElement, offSet: number) {
    const leftEar = keypoints[LANDMARKS.LEFT_EAR];
    const rightEar = keypoints[LANDMARKS.RIGHT_EAR];
    const leftEye = keypoints[2];
    const rightMouth = keypoints[10];
  
    const leftTopCornerPoint = {x: leftEar.x - offSet, y: leftEye.y - offSet};
    const rightBottomCornerPoint = {x: rightEar.x + offSet, y: rightMouth.y + offSet};
  
    return clickSnipFromCanvas(canvas, leftTopCornerPoint, rightBottomCornerPoint);
  }
  
function getShoulderTiltSnip(keypoints: poseDetection.Keypoint[], canvas: HTMLCanvasElement, offSet) {
    const leftShoulder = keypoints[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = keypoints[LANDMARKS.RIGHT_SHOULDER];
    const rightElbow = keypoints[LANDMARKS.RIGHT_ELBOW];
    const rightMouth = keypoints[10];
  
    const leftTopCornerPoint = {x: leftShoulder.x - offSet, y: rightMouth.y};
    const rightBottomCornerPoint = {x: rightShoulder.x + offSet, y: rightElbow.y};
  
    return clickSnipFromCanvas(canvas, leftTopCornerPoint, rightBottomCornerPoint);
  };


  function getPelvicTiltSnip(keypoints: poseDetection.Keypoint[], canvas: HTMLCanvasElement, offSet) {
    const leftHip = keypoints[LANDMARKS.LEFT_HIP];
    const rightHip = keypoints[LANDMARKS.RIGHT_HIP];
    const rightKnee = keypoints[LANDMARKS.RIGHT_KNEE];
  
    const leftTopCornerPoint = {x: leftHip.x - offSet, y: leftHip.y - offSet*2};
    const rightBottomCornerPoint = {x: rightHip.x + offSet, y: rightKnee.y};
  
    return clickSnipFromCanvas(canvas, leftTopCornerPoint, rightBottomCornerPoint);
  };

  function getKneeTiltSnip(keypoints: poseDetection.Keypoint[], canvas: HTMLCanvasElement, offSet) {
    const leftKnee = keypoints[LANDMARKS.LEFT_KNEE];
    const rightKnee = keypoints[LANDMARKS.RIGHT_KNEE];
    const leftHip = keypoints[LANDMARKS.LEFT_HIP];
    const rightAnkle = keypoints[LANDMARKS.RIGHT_ANKLE];
  
    const leftTopCornerPoint = {x: leftKnee.x - offSet, y: leftHip.y};
    const rightBottomCornerPoint = {x: rightKnee.x + offSet, y: rightAnkle.y};
  
    return clickSnipFromCanvas(canvas, leftTopCornerPoint, rightBottomCornerPoint);
  };
  
  const clickSnipFromCanvas = (canvas: HTMLCanvasElement, leftTopCornerPoint: Point, rightBottomCornerPoint: Point): string => {
    var ctx = canvas.getContext('2d');
  
    const newCanvas = document.createElement('canvas');
    newCanvas.width = rightBottomCornerPoint.x - leftTopCornerPoint.x;
    newCanvas.height = rightBottomCornerPoint.y - leftTopCornerPoint.y;
    const newCtx = newCanvas.getContext('2d');
  
    var imageData = ctx.getImageData(+leftTopCornerPoint.x.toFixed(2),
    +leftTopCornerPoint.y.toFixed(2), +rightBottomCornerPoint.x.toFixed(2), +rightBottomCornerPoint.y.toFixed(2));
  
    newCtx.putImageData(imageData, 0, 0);
    const dataURI = newCanvas.toDataURL('image/png');
    return dataURI; 
  }

  const ANGLES = [
    {
      left: LANDMARKS.LEFT_EAR,
      right: LANDMARKS.RIGHT_EAR,
      inference: HEAD_TILT,
      snipFn: getHeadTiltSnip
    },
    {
      left: LANDMARKS.LEFT_SHOULDER,
      right: LANDMARKS.RIGHT_SHOULDER,
      inference: SHOULDER_TILT,
      snipFn: getShoulderTiltSnip
    },
    {
      left: LANDMARKS.LEFT_HIP,
      right: LANDMARKS.RIGHT_HIP,
      inference: PELVIC_TILT,
      snipFn: getPelvicTiltSnip
    },
    {
      left: LANDMARKS.LEFT_KNEE,
      right: LANDMARKS.RIGHT_KNEE,
      inference: KNEE_TILT,
      snipFn: getKneeTiltSnip
    },
  ];

  export { findAngle, getMidPoint, getHeadTiltSnip, getKneeTiltSnip, getShoulderTiltSnip, getPelvicTiltSnip, ANGLES };