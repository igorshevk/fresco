import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line, Rect, Star, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  ObjectSnappingEdges,
  TransformShapeProps,
} from '../../../../components/DrawCanvas/types';

function LineTransform(props: TransformShapeProps): JSX.Element {
  const {
    data,
    onSelect,
    onChange,
    onChanging,
    onChangeStart,
    onContextMenu,
  } = props;
  const [focus, setFocus] = useState(false);
  const shapeRef = useRef<Konva.Line>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Line;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChange({
        ...data,
        x: node?.x(),
        y: node?.y(),
        rotation: Math.round(node?.attrs.rotation as number),
        line: [
          {
            x: 0,
            y: 0,
          },
          {
            x: Math.max(5, node?.width() * scaleX),
            y: Math.max(5, node?.height() * scaleY),
          },
        ],
      });
    },
    [data, onChange],
  );

  const onTransform = useCallback((e: Konva.KonvaEventObject<Event>) => {
    const node = shapeRef.current as Konva.Line;
    const scaleX = node?.scaleX();
    const scaleY = node?.scaleY();
    node?.scaleX(1);
    node?.scaleY(1);
    // onChanging({
    //   ...data,
    //   x: node?.x(),
    //   y: node?.y(),
    //   rotation: Math.round(node?.attrs.rotation as number),
    //   line: [
    //     {
    //       x: node?.x(),
    //       y: node?.y(),
    //     },
    //     {
    //       x: Math.max(5, node?.width() * scaleX),
    //       y: Math.max(5, node?.height() * scaleY),
    //     },
    //   ],
    // });
  }, []);

  const onDragMove = e => {
    const node = shapeRef.current as Konva.Line;
    var box = node.getClientRect(node?.attrs);
    var absPos = node.absolutePosition();
    const edges: ObjectSnappingEdges = {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(absPos.x - box.x),
          snap: 'start',
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(absPos.x - box.x - box.width / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(absPos.x - box.x - box.width),
          snap: 'end',
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(absPos.y - box.y),
          snap: 'start',
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(absPos.y - box.y - box.height / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(absPos.y - box.y - box.height),
          snap: 'end',
        },
      ],
    };
    onChanging(e.target, edges);
  };

  const onDragEnd = useCallback(
    e => {
      console.log(e);
      onChange({
        ...data,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [data, onChange],
  );

  useEffect(() => {
    if (data.isSelected) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current as Konva.Line]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <React.Fragment>
      <Line
        x={data.x}
        y={data.y}
        points={(() => {
          const points: number[] = [];
          data.line?.forEach(point => {
            points.push(point.x);
            points.push(point.y);
          });
          return points;
        })()}
        stroke={data.shapeConfig?.stroke || '#000000'}
        strokeWidth={focus ? 10 : 2}
        lineCap="round"
        lineJoin="round"
        id={data.id}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable={!data.isLocked && data.isEditable}
        onTransformStart={() => onChangeStart(data)}
        // onTransform={onTransform}
        onTransformEnd={onTransformEnd}
        onDragStart={() => onChangeStart(data)}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        rotation={data.rotation}
        opacity={
          data.isLocked
            ? Math.max(0.1, (data.shapeConfig?.opacity as number) - 0.2)
            : (data.shapeConfig?.opacity as number)
        }
        onMouseEnter={() => {
          setFocus(true);
        }}
        onMouseLeave={() => {
          setFocus(false);
        }}
        onContextMenu={onContextMenu}
        name="object"
      />
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default LineTransform;
