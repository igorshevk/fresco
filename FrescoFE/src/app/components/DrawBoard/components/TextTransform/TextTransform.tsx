import React, { useCallback, useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { StickyProperty, TransformShapeProps } from '../../types';

function TextTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect, onChange, onChanging, onChangeStart } = props;
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Text;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChange({
        ...data,
        x: Math.round(node?.x()),
        y: Math.round(node?.y()),
        rotation: Math.round(node.attrs.rotation),
        textData: {
          ...(data.textData as StickyProperty),
          width: Math.round(Math.max(5, node?.width() * scaleX)),
          height: Math.round(Math.max(node?.height() * scaleY)),
        },
      });
    },
    [data, onChange],
  );

  const onTransform = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Text;
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
      trRef.current?.nodes([shapeRef.current as Konva.Text]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <React.Fragment>
      <Text
        id={data.id}
        fill="#000000"
        x={data.x}
        y={data.y}
        fillEnabled={true}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...data.textData}
        text={data.sticky?.text ? data.sticky?.text : 'Sticky notes area'}
        draggable={!data.isLocked}
        onTransformStart={() => onChangeStart(data)}
        // onTransform={onTransform}
        onTransformEnd={onTransformEnd}
        onDragStart={() => onChangeStart(data)}
        // onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        rotation={data.rotation}
        opacity={data.isLocked ? 0.5 : 0.8}
      />
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default TextTransform;
