import { ObjectInterface, ShapeObjectType } from '../types';
import { Vector2d } from 'konva/types/types';
import _ from 'lodash';

export function onMouseMove(
  state: ObjectInterface,
  drawingTool: ShapeObjectType,
  position: Vector2d,
): ObjectInterface {
  const width = Math.abs(position.x - state.x);
  const height = Math.abs(position.y - state.y);

  const data: ObjectInterface = {
    ...state,
  };

  const dimensions = {
    height,
    width,
  };

  if (drawingTool === 'RectRounded') {
    _.set(data, 'rect', {
      cornerRadius: 20,
      ...dimensions,
    });
  } else if (drawingTool === 'Rect') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      ...dimensions,
    });
  } else if (drawingTool === 'Star') {
    _.set(data, 'star', {
      innerRadius: Math.round(Math.min(width, height) / 2),
      outerRadius: Math.min(width, height),
      numPoints: 5,
    });
  } else if (drawingTool === 'Triangle') {
    _.set(data, 'triangle', {
      ...dimensions,
    });
  } else if (drawingTool === 'Ellipse') {
    _.set(data, 'ellipse', {
      radiusX: Math.abs(width),
      radiusY: Math.abs(height),
    });
  } else if (drawingTool === 'Text' || drawingTool === 'Sticky') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      ...dimensions,
    });
  } else if (drawingTool === 'Line') {
    _.set(data, 'line', [
      {
        x: 0,
        y: 0,
      },
      {
        x: position.x - state.x,
        y: position.y - state.y,
      },
    ]);
  }

  return data;
}
