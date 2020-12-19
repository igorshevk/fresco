import { ObjectInterface, ShapeObjectType } from '../types';
import { defaultObjectState } from '../constants';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Vector2d } from 'konva/types/types';

export function onMouseDown(
  state: ObjectInterface,
  drawingTool: ShapeObjectType,
  position: Vector2d,
): ObjectInterface {
  const data: ObjectInterface = {
    ...state,
    ...defaultObjectState,
    id: uuidv4(),
    rotation: 0,
    x: Math.round(position.x),
    y: Math.round(position.y),
    type: drawingTool,
  };

  if (drawingTool === 'RectRounded') {
    _.set(data, 'rect', {
      cornerRadius: 20,
      height: 0,
      width: 0,
    });
  } else if (drawingTool === 'Rect') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      height: 0,
      width: 0,
    });
  } else if (drawingTool === 'Star') {
    _.set(data, 'star', {
      innerRadius: 0,
      outerRadius: 0,
      numPoints: 5,
    });
  } else if (drawingTool === 'Triangle') {
    _.set(data, 'triangle', {
      innerRadius: 0,
      outerRadius: 0,
      numPoints: 5,
    });
  } else if (drawingTool === 'Ellipse') {
    _.set(data, 'ellipse', {
      radiusX: 0,
      radiusY: 0,
    });
  } else if (drawingTool === 'Text' || drawingTool === 'Sticky') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      height: 0,
      width: 0,
    });
  } else if (drawingTool === 'Line') {
    _.set(data, 'line', [
      {
        x: 0,
        y: 0,
      },
    ]);
  }

  return data;
}
