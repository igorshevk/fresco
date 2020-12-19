import React, { useCallback, useEffect, useRef } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  ObjectInterface,
  StickyProperty,
  TransformShapeProps,
} from '../../../DrawBoard/types';

interface Props extends TransformShapeProps {
  onEdit(data: ObjectInterface): void;
}

function StickyTransform(props: Props): JSX.Element {
  const { data, onSelect, onChange, onChanging, onChangeStart, onEdit } = props;
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Group;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChange({
        ...data,
        x: Math.round(node?.x()),
        y: Math.round(node?.y()),
        rotation: Math.round(node?.attrs.rotation as number),
        sticky: {
          ...(data.sticky as StickyProperty),
          width: Math.round(Math.max(5, node?.width() * scaleX)),
          height: Math.round(Math.max(node?.height() * scaleY)),
        },
        rect: {
          width: Math.max(5, node?.width() * scaleX),
          height: Math.max(node?.height() * scaleY),
          cornerRadius: 0,
        },
      });
    },
    [data, onChange],
  );

  const onTransform = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Group;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChanging({
        ...data,
        x: node?.x(),
        y: node?.y(),
        rotation: Math.round(node?.attrs.rotation as number),
        rect: {
          width: Math.max(5, node?.width() * scaleX),
          height: Math.max(node?.height() * scaleY),
          cornerRadius: data.rect?.cornerRadius as number,
        },
      });
    },
    [data, onChanging],
  );

  const onDragMove = useCallback(
    e => {
      onChanging({
        ...data,
        x: e.target.x(),
        y: e.target.y(),
        isLocked: true,
      });
    },
    [data, onChanging],
  );

  const onDragEnd = useCallback(
    e => {
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
      trRef.current?.nodes([shapeRef.current as Konva.Group]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <>
      <Group
        id={data.id}
        draggable={!data.isLocked}
        onTransformStart={() => onChangeStart(data)}
        // onTransform={onTransform}
        onDblClick={() =>
          onEdit({
            ...data,
            isEditing: true,
            isSelected: true,
          })
        }
        onTransformEnd={onTransformEnd}
        onDragStart={() => onChangeStart(data)}
        // onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        x={data.x}
        y={data.y}
        height={data.rect?.height as number}
        width={data.rect?.width as number}
        rotation={data.rotation}
      >
        <Rect
          id={data.id + ':Rect'}
          x={0}
          y={0}
          height={data.rect?.height as number}
          width={data.rect?.width as number}
          fill={data.sticky?.backgroundColor}
          opacity={data.isLocked ? 0.5 : 0.8}
          stroke={data.sticky?.stroke}
        />

        <Text
          {...data.sticky}
          stroke={undefined}
          fill={data.sticky?.fontColor}
          height={data.rect?.height as number}
          width={data.rect?.width as number}
          id={data.id + ':Text'}
          x={0}
          y={0}
          text={data.sticky?.text ? data.sticky?.text : 'Sticky notes area'}
          fillEnabled={true}
        />
      </Group>
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </>
  );
}

export default StickyTransform;
