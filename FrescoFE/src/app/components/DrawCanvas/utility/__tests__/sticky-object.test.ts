import { ObjectInterface, ShapeObjectType } from '../../types';
import { Vector2d } from 'konva/types/types';
import { defaultObjectState, defaultTextProperties } from '../../constants';
import { v4 as uuidV4 } from 'uuid';
import { onMouseDown, onMouseMove, onMouseUp } from '../index';

describe('Draw Sticky On Canvas', () => {
  let state: ObjectInterface = { ...defaultObjectState };
  const defaultPointerPositions: Vector2d = { x: 0, y: 0 };
  let drawingTool: ShapeObjectType = 'Sticky';
  let id = uuidV4();

  beforeEach(() => {
    state = { ...defaultObjectState };
  });

  it('should handle onMouseDown Start Drawing Sticky Object', () => {
    const pointerPositions: Vector2d = { x: 0, y: 0 };
    const objectState = { ...state };
    expect(onMouseDown(objectState, drawingTool, pointerPositions, id)).toEqual(
      {
        ...objectState,
        id: id,
        type: drawingTool,
        rect: {
          cornerRadius: 0,
          height: 0,
          width: 0,
        },
      },
    );
  });

  it('should handle onMouseMove Drawing Sticky Object', () => {
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
      rect: {
        cornerRadius: 0,
        height: pointerPositions.y,
        width: pointerPositions.x,
      },
    });
  });

  it('should handle onMouseUp End Drawing Sticky Object', () => {
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
      rect: {
        cornerRadius: 0,
        height: pointerPositions.y,
        width: pointerPositions.x,
      },
      sticky: {
        ...defaultTextProperties,
        text: 'Sticky notes area',
        backgroundColor: '#f5ecfd',
      },
    });
  });
});
