import { ObjectInterface, ShapeObjectType } from '../../types';
import { Vector2d } from 'konva/types/types';
import { defaultObjectState } from '../../constants';
import { v4 as uuidV4 } from 'uuid';
import { onMouseDown, onMouseMove, onMouseUp } from '../index';

describe('Draw Ellipse On Canvas', () => {
  let state: ObjectInterface = { ...defaultObjectState };
  const defaultPointerPositions: Vector2d = { x: 0, y: 0 };
  let drawingTool: ShapeObjectType = 'Ellipse';
  let id = uuidV4();

  beforeEach(() => {
    state = { ...defaultObjectState };
  });

  it('should handle onMouseDown Start Drawing Ellipse Object', () => {
    const pointerPositions: Vector2d = { x: 0, y: 0 };
    const objectState = { ...state };
    expect(onMouseDown(objectState, drawingTool, pointerPositions, id)).toEqual(
      {
        ...objectState,
        id: id,
        type: drawingTool,
        ellipse: {
          radiusX: 0,
          radiusY: 0,
        },
      },
    );
  });

  it('should handle onMouseMove Drawing Ellipse Object', () => {
    let pointerPositions: Vector2d = { x: 12, y: 22 };
    const objectState: ObjectInterface = {
      ...state,
      id,
      type: drawingTool,
      ...defaultPointerPositions,
    };
    expect(onMouseMove(objectState, drawingTool, pointerPositions)).toEqual({
      ...objectState,
      id: id,
      type: drawingTool,
      ellipse: {
        radiusX: pointerPositions.x,
        radiusY: pointerPositions.y,
      },
    });
  });

  it('should handle onMouseUp End Drawing Ellipse Object', () => {
    let pointerPositions: Vector2d = { x: 32, y: 44 };
    const objectState: ObjectInterface = {
      ...state,
      id,
      type: drawingTool,
      ...defaultPointerPositions,
    };
    expect(onMouseUp(objectState, drawingTool, pointerPositions)).toEqual({
      ...objectState,
      id: id,
      type: drawingTool,
      ellipse: {
        radiusX: pointerPositions.x,
        radiusY: pointerPositions.y,
      },
    });
  });
});
