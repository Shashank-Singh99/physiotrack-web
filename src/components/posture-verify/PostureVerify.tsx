import * as poseDetection from "@tensorflow-models/pose-detection";
import {
  LegacyRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Line,
  Arc,
} from "react-konva";
import useImage from "use-image";
import { Image as KonvaImageType } from "konva/lib/shapes/Image";
import { KonvaEventObject } from "konva/lib/Node";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";
import { Point, ReportData } from "../../types/types";
import { ANGLES, findAngle, getMidPoint } from "./utils";
import { BLACK_LIST, CONNECTIONS, LM } from "./constants";
import { Stage as StageType } from "konva/lib/Stage";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
import Fab from "@mui/material/Fab";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RoomIcon from "@mui/icons-material/Room";
import { useSearchParams } from "react-router-dom";
import { ScreenshotContext } from "../../contexts/ScreenshotContextProvider";
import { ReportDataContext } from "../../contexts/ReportDataContextProvider";
import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
} from "../../utils/canvasEvents";
import CustomLoader from "../CustomLoader";
import OverlayLoader from "../OverlayLoader";

const detectorConfig = {
  runtime: "tfjs",
  modelType: "heavy",
  solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose/",
  enableSmoothing: false,
};

type ArcType = {
  angle: number;
  radius: number;
  x: number;
  y: number;
  clockWise: boolean;
  inference: string;
  snipImgSrc?: string;
};

async function wait<T>(ms: number, value: T) {
  return new Promise<T>((resolve) => setTimeout(resolve, ms, value));
}

function PostureVerify() {
  const [queryParameters] = useSearchParams();

  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const { setClientWidth, setClientHeight } = useContext(DimensionsContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [keyPoints, setKeyPoints] = useState<poseDetection.Keypoint[]>([]);
  const [arcs, setArcs] = useState<ArcType[]>([]);
  const [isPostureVerified, setIsPostureVerified] = useState(false);
  const [detector, setDetector] = useState<poseDetection.PoseDetector>(null);

  const [showOverlaySpinner, setShowOverlaySpinner] = useState(false);
  const [lineOfGravityPoints, setLineOfGravityPoints] = useState([]);

  const { screenshot, setScreenshot } = useContext(ScreenshotContext);
  const { setReportData } = useContext(ReportDataContext);

  const konvaRef = useRef<KonvaImageType>(null);
  const stageRef = useRef<StageType>(null);

  const imgUrl = queryParameters.get("imgUrl");
  const [image] = useImage(imgUrl);

  // this is awesome
  useEffect(() => {
    if (image) {
      image.crossOrigin = "anonymous";
    }
  });

  useEffect(() => {
    const w = +queryParameters.get("width");
    const h = +queryParameters.get("height");
    setScreenshot(imgUrl);
    setHeight(h);
    setWidth(w);
    setClientWidth(w);
    setClientHeight(h);
    console.log(w);
    console.log(h);
  }, []);

  useEffect(() => {
    async function getDetector() {
      try {
        if (detector === null) {
          setLoading(true);
          await tf.setBackend("webgl");
          await tf.ready();
          const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            detectorConfig
          );
          setDetector(detector);
          setLoading(false);
        }
        return;
      } catch (error) {
        console.error("Error has occured while initializing model");
        console.error(error);
        setError(error);
        setLoading(false);
      }
    }
    getDetector();
  }, []);

  useEffect(() => {
    if (arcs.length > 0) {
      setScreenshot(stageRef.current.toDataURL());
    }
  }, [arcs]);

  const drawArcs = (
    leftNumber: number,
    rightNumber: number,
    inference: string,
    snipFn?: (...args: any[]) => string
  ): ArcType => {
    if (keyPoints.length <= 0) return;

    const right = keyPoints[rightNumber] as poseDetection.Keypoint;
    const left = keyPoints[leftNumber] as poseDetection.Keypoint;
    const p1: Point = { x: right.x, y: right.y };
    const p2: Point = { x: left.x, y: left.y };

    const midPoint = getMidPoint(p2, p1);
    const offSet = (midPoint.x - p2.x) / 2;
    const p3: Point = { x: midPoint.x + offSet, y: left.y };

    const angleInRadians = findAngle(p1, p2, p3);

    const angleInDegrees = angleInRadians * (180 / Math.PI);

    return drawArc(p1, p2, p3, angleInDegrees, inference, snipFn);
  };

  const confirmPosture = async () => {
    const drawnArcs: ArcType[] = ANGLES.map((a) =>
      drawArcs(a.left, a.right, a.inference, undefined)
    );
    setArcs(drawnArcs);

    drawLineOfGravity();

    await wait(1000, "Apple");

    const reportArcs: ArcType[] = ANGLES.map((a) =>
      drawArcs(a.left, a.right, a.inference, a.snipFn)
    );
    const reportData: ReportData[] = reportArcs.map((arc) => {
      return {
        inference: arc.inference,
        angle: arc.angle,
        snipImgSrc: arc.snipImgSrc,
      };
    });
    setReportData(reportData);
  };

  const drawLineOfGravity = () => {
    const nose = keyPoints[LM.NOSE];
    const rightShoulder = keyPoints[LM.RIGHT_SHOULDER];
    const leftShoulder = keyPoints[LM.LEFT_SHOULDER];
    const rightHip = keyPoints[LM.RIGHT_HIP];
    const leftHip = keyPoints[LM.LEFT_HIP];
    const rightFoot = keyPoints[LM.RIGHT_FOOT];
    const leftFoot = keyPoints[LM.LEFT_FOOT];
    const rightKnee = keyPoints[LM.RIGHT_KNEE];
    const leftKnee = keyPoints[LM.LEFT_KNEE];


    const shoulderMidPoint = getMidPoint(rightShoulder, leftShoulder);
    const pelvicMidPoint = getMidPoint(rightHip, leftHip);
    const footMidPoint = getMidPoint(rightFoot, leftFoot);
    const kneeMidPoint = getMidPoint(rightKnee, leftKnee);

    const lineOfGravityArray  = [nose.x, nose.y - 100, shoulderMidPoint.x, shoulderMidPoint.y,  pelvicMidPoint.x, pelvicMidPoint.y, kneeMidPoint.x, kneeMidPoint.y, footMidPoint.x, footMidPoint.y];
    setLineOfGravityPoints(lineOfGravityArray);    
  };

  function drawArc(
    p1: Point,
    p2: Point,
    p3: Point,
    angle: number,
    inference: string,
    snipFn?: (...args: any[]) => string
  ): ArcType {
    const radius = p3.x - p2.x;
    const isCounterClockwise = p3.y > p1.y;
    const endAngle = p3.y > p1.y ? -angle : angle;

    const midPoint = getMidPoint(p2, p1);
    const offSet = (midPoint.x - p2.x) / 2;

    const arc: ArcType = {
      radius,
      angle: endAngle,
      x: p2.x,
      y: p2.y,
      clockWise: isCounterClockwise,
      inference,
    };

    if (snipFn) {
      const snipImgSrc = snipFn(keyPoints, stageRef.current.toCanvas(), offSet);
      arc["snipImgSrc"] = snipImgSrc;
    }

    return arc;
  }

  const getNonTaintedImage = (): HTMLImageElement => {
    const image = new Image();
    image.src = screenshot;
    image.crossOrigin = "anonymous";
    image.width = width;
    image.height = height;
    return image;
  };

  async function drawImageWithLandmarksOnCanvas() {
    setShowOverlaySpinner(true);
    console.log("Apple : ", 0);
    if (!konvaRef.current || !detector) return;
    try {
      console.log("Apple");
      const image = getNonTaintedImage();
      console.log("Orange");
      const poses = await detector.estimatePoses(image);
      console.log("Kiwi");
      setKeyPoints(poses[0].keypoints);
      console.log(poses[0].keypoints);
      console.log("Guava");
      setShowOverlaySpinner(false);
    } catch (e) {
      console.log("Error spotted");
      console.error(e);
      setShowOverlaySpinner(false);
    }
  }

  const handleDragStart = (
    e: KonvaEventObject<DragEvent>,
    pointName: string
  ) => {
    console.log("Point index : ", pointName, " Points : ", e.target.x());
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, pointName: string) => {
    console.log("Point index : ", pointName, " Points : ", e.target.x());
    const updatedKeyPoints = keyPoints.map((point) => {
      if (point.name === pointName) {
        point.x = e.target.x();
        point.y = e.target.y();
      }
      return point;
    });
    setKeyPoints(updatedKeyPoints);
  };

  const verifyPosture = async () => {
    setShowOverlaySpinner(true);
    setIsPostureVerified(true);
    await confirmPosture();
    setShowOverlaySpinner(false);
  };

  if (error) {
    return <>Error: {error}</>;
  }

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div>
      { showOverlaySpinner && <OverlayLoader /> }
      {keyPoints && (
        <Stage
          width={width}
          height={height}
          ref={stageRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Layer>
            <CustomImage
              ref={konvaRef}
              image={image}
              width={width}
              height={height}
            />
          </Layer>
          <Layer>
            {keyPoints
              .filter((keypoint) => !BLACK_LIST.includes(keypoint.name))
              .map((keyPoint) => {
                return (
                  <Circle
                    x={keyPoint.x}
                    y={keyPoint.y}
                    key={keyPoint.name}
                    radius={4}
                    fill="white"
                    stroke="blue"
                    strokeWidth={2}
                    onDragStart={(e) => handleDragStart(e, keyPoint.name)}
                    onDragEnd={(e) => handleDragEnd(e, keyPoint.name)}
                    draggable
                  ></Circle>
                );
              })}
          </Layer>
          {isPostureVerified && keyPoints.length > 0 && (
            <Layer>
              {CONNECTIONS.map((con, index) => {
                return (
                  <Line
                    key={index}
                    points={[
                      keyPoints[con[0]].x,
                      keyPoints[con[0]].y,
                      keyPoints[con[1]].x,
                      keyPoints[con[1]].y,
                    ]}
                    stroke="white"
                    strokeWidth={2}
                    perfectDrawEnabled
                  />
                );
              })}
            </Layer>
          )}
          {isPostureVerified && arcs.length > 0 && (
            <Layer>
              {arcs.map((angle, index) => {
                return (
                  <Arc
                    key={index}
                    angle={angle.angle}
                    x={angle.x}
                    y={angle.y}
                    stroke="red"
                    strokeWidth={1}
                    innerRadius={angle.radius}
                    outerRadius={0}
                    clockwise={angle.clockWise}
                  />
                );
              })}
            </Layer>
          )}

          { isPostureVerified && arcs.length > 0 && (
            <Layer>
              <Line
                    points={lineOfGravityPoints}
                    stroke="red"
                    strokeWidth={2}
                    dash={[3,3]}
                    perfectDrawEnabled
                  />
            </Layer>
          )}
        </Stage>
      )}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", top: 550, right: 36, width: 50, height: 50 }}
        onClick={verifyPosture}
      >
        <RoomIcon />
      </Fab>
      <Fab
        color="secondary"
        aria-label="add"
        sx={{ position: "absolute", top: 550, left: 36, width: 50, height: 50 }}
        onClick={drawImageWithLandmarksOnCanvas}
      >
        <AutoFixHighIcon />
      </Fab>
    </div>
  );
}

type CustomImageProps = {
  image: HTMLImageElement;
  width: number;
  height: number;
};

const CustomImage = forwardRef(
  (props: CustomImageProps, ref: LegacyRef<KonvaImageType>) => {
    return (
      <KonvaImage
        ref={ref}
        image={props.image}
        width={props.width}
        height={props.height}
      />
    );
  }
);

export default PostureVerify;
