import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

let lastCenter = null;
let lastDist = 0;
let dragStopped = false;

const getDistance = (p1: Vector2d, p2: Vector2d): number =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const getCenter = (p1: Vector2d, p2: Vector2d): Vector2d => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});

const handleTouchStart = (event: KonvaEventObject<TouchEvent>) => {
  event.evt.preventDefault();
  const { currentTarget: stage } = event;
  const [touch1, touch2] = event.evt.touches;
  if (touch1 && touch2) {
    if (stage.isDragging()) {
      dragStopped = true;
      stage.stopDrag();
    }
  }
};

const handleTouchEnd = (event: KonvaEventObject<TouchEvent>) => {
  lastDist = 0;
  lastCenter = null;
  if (event.evt.defaultPrevented) {
    return;
  }
  event.evt.preventDefault();
  const { currentTarget: stage } = event;

  if (!(stage instanceof Konva.Stage)) {
    return;
  }

  if (event.evt.touches.length !== 2) {
    return;
  }

  const [touch1, touch2] = event.evt.touches;

  // we need to restore dragging, if it was cancelled by multi-touch
  if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
    stage.startDrag();
    dragStopped = false;
  }
};

const handleTouchMove = (event: KonvaEventObject<TouchEvent>) => {
  if (event.evt.defaultPrevented) {
    return;
  }
  event.evt.preventDefault();
  const { currentTarget: stage } = event;

  if (!(stage instanceof Konva.Stage)) {
    return;
  }

  if (event.evt.touches.length !== 2) {
    return;
  }

  const [touch1, touch2] = event.evt.touches;

  // we need to restore dragging, if it was cancelled by multi-touch
  if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
    stage.startDrag();
    dragStopped = false;
  }

  if (touch1 && touch2) {
    // if the stage was under Konva's drag&drop
    // we need to stop it, and implement our own pan logic with two pointers
    if (stage.isDragging()) {
      dragStopped = true;
      stage.stopDrag();
    }

    const p1 = { x: touch1.clientX, y: touch1.clientY };
    const p2 = { x: touch2.clientX, y: touch2.clientY };

    if (!lastCenter) {
      lastCenter = getCenter(p1, p2);
      return;
    }
    var newCenter = getCenter(p1, p2);

    var dist = getDistance(p1, p2);

    if (!lastDist) {
      lastDist = dist;
    }

    // local coordinates of center point
    var pointTo = {
      x: (newCenter.x - stage.x()) / stage.scaleX(),
      y: (newCenter.y - stage.y()) / stage.scaleX(),
    };

    var scale = stage.scaleX() * (dist / lastDist);

    stage.scaleX(scale);
    stage.scaleY(scale);

    // calculate new position of the stage
    var dx = newCenter.x - lastCenter.x;
    var dy = newCenter.y - lastCenter.y;

    var newPos = {
      x: newCenter.x - pointTo.x * scale + dx,
      y: newCenter.y - pointTo.y * scale + dy,
    };

    stage.position(newPos);

    lastDist = dist;
    lastCenter = newCenter;
  }
};

export { handleTouchStart, handleTouchMove, handleTouchEnd};