import React, { useCallback, useEffect, useRef } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  ObjectInterface,
  ObjectSnappingEdges,
  StickyProperty,
  TransformShapeProps,
} from '../../../../components/DrawCanvas/types';

interface Props extends TransformShapeProps {
  onEdit(data: ObjectInterface): void;
}

function StickyTransform(props: Props): JSX.Element {
  const {
    data,
    onSelect,
    onChange,
    onChanging,
    onChangeStart,
    onEdit,
    onContextMenu,
  } = props;
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

  const onTransform = useCallback((e: Konva.KonvaEventObject<Event>) => {
    const node = shapeRef.current as Konva.Group;
    const scaleX = node?.scaleX();
    const scaleY = node?.scaleY();
    node?.scaleX(1);
    node?.scaleY(1);
    // onChanging({
    //   ...data,
    //   x: node?.x(),
    //   y: node?.y(),
    //   rotation: Math.round(node?.attrs.rotation as number),
    //   rect: {
    //     width: Math.max(5, node?.width() * scaleX),
    //     height: Math.max(node?.height() * scaleY),
    //     cornerRadius: data.rect?.cornerRadius as number,
    //   },
    // });
  }, []);

  const onDragMove = e => {
    const node = shapeRef.current as Konva.Group;
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

  const getText = () => {
    let text = '';
    if (data.sticky?.text) {
      text = data.sticky?.text;
    } else if (data.type === 'Sticky') {
      text = 'Sticky notes area';
    } else if (data.type === 'Text') {
      text = 'Type something here';
    }

    if (data.isEditing) {
      text = '';
    }
    return text;
  };

  return (
    <>
      <Group
        id={data.id}
        draggable={!data.isLocked && data.isEditable}
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
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        x={data.x}
        y={data.y}
        height={data.rect?.height as number}
        width={data.rect?.width as number}
        rotation={data.rotation}
        onContextMenu={onContextMenu}
        name="object"
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
          text={getText()}
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
