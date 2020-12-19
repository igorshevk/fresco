import React, { PureComponent } from 'react';
import {
  Ellipse,
  Group,
  Layer,
  Rect,
  Shape,
  Stage,
  Star,
  Text,
  Line,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import {
  ObjectInterface,
  ObjectSnappingEdges,
  ObjectSnappingGuide,
  ObjectSnappingResult,
  ObjectSocketInterface,
  Props,
  State,
  StickyProperty,
} from './types';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import { defaultObjectState, fontNames } from './constants';
import { Dropdown, Menu, Select } from 'antd';
import {
  EllipseTransform,
  LineTransform,
  RectTransform,
  StarTransform,
  StickyTransform,
  TriangleTransform,
} from './components';
import {
  BorderStyleIcon,
  ChevronDownIcon,
  FillColorIcon,
  MarkerIcon,
  MinusSquareIcon,
  MoreIcon,
  PlusSquareIcon,
  TextAlignmentIcon,
  TextBoldIcon,
  TextColorIcon,
  TextUnderLineIcon,
  VerticalLineIcon,
} from '../CanvasIcons';
import {
  BoardApiService,
  CanvasApiService,
  ImageUploadingService,
} from '../../../services/APIService';
import { onMouseDown, onMouseMove, onMouseUp } from './utility';

export enum BoardSocketEventEnum {
  CREATE = 'create',
  MOVE = 'move',
  UPDATE = 'update',
  DELETE = 'delete',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  JOIN_BOARD = 'joinBoard',
  LEAVE_BOARD = 'leaveBoard',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

class DrawCanvas extends PureComponent<Props, State> {
  socket: SocketIOClient.Socket;
  state: State = {
    id: uuidv4(),
    objects: [],
    points: {
      ...defaultObjectState,
    },
    prevHistory: [],
    nextHistory: [],
    canvas: {
      name: '',
      orgId: '',
      categoryId: '',
      imageId: '',
    },
    pointerPosition: {
      x: 0,
      y: 0,
    },
  };
  stageRef: Konva.Stage | null = null;
  layerRef: Konva.Layer | null = null;

  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;
  GUIDELINE_OFFSET = 5;

  constructor(props) {
    super(props);
    const url = new URL(process.env.REACT_APP_BASE_URL as string);
    url.pathname = 'board';
    this.socket = socketIOClient(url.href, {
      transports: ['websocket'],
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);

    this.redoHistory();
    this.undoHistory();

    const saveCanvas = document.getElementById('save-canvas') as HTMLDivElement;
    saveCanvas.addEventListener('click', () => {
      this.save();
    });
    this.getCanvasObject();
    this.canvasWebSockets();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    this.handleChangeCursor();
  }

  onKeyDown = event => {
    if (event.key === 'Delete') {
      const currentObject = this.state.objects.find(
        shapeObject => shapeObject.isSelected,
      );
      if (currentObject) {
        this.deleteObject(
          { id: this.state.id, data: currentObject },
          {
            emitEvent: true,
            saveHistory: true,
            saveCanvas: true,
          },
        );
      }
    } else if (event.ctrlKey && event.key.toLowerCase() === 'y') {
      const redoHistory = document.getElementById(
        'redo-history',
      ) as HTMLDivElement;
      redoHistory.click();
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
      const undoHistory = document.getElementById(
        'undo-history',
      ) as HTMLDivElement;
      undoHistory.click();
    }
  };

  canvasWebSockets(): void {
    this.socket.on(BoardSocketEventEnum.CONNECT, () => {
      console.log('Socket ' + BoardSocketEventEnum.CONNECT);
      this.socket.emit(
        BoardSocketEventEnum.JOIN_BOARD,
        this.props.match?.params.id,
      );
    });
    this.socket.on(BoardSocketEventEnum.CREATE, (event: string) => {
      this.createObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.JOIN_BOARD, (data: string) => {
      console.log('Socket ' + BoardSocketEventEnum.JOIN_BOARD, data);
    });
    this.socket.on(BoardSocketEventEnum.LEAVE_BOARD, (data: string) => {
      console.log('Socket ' + BoardSocketEventEnum.LEAVE_BOARD, data);
    });
    this.socket.on(BoardSocketEventEnum.UPDATE, (event: string) => {
      this.updateObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.MOVE, (event: string) => {
      console.log(BoardSocketEventEnum.MOVE, event);
      this.moveObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.LOCK, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.LOCK, event);
      this.lockObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.UNLOCK, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.UNLOCK, event);
    });
    this.socket.on(BoardSocketEventEnum.DELETE, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.DELETE, event);
      this.deleteObject(JSON.parse(event), { saveHistory: true });
    });
    this.socket.on(BoardSocketEventEnum.CREATE, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.CREATE, event);
    });
    this.socket.on(BoardSocketEventEnum.DISCONNECT, () => {
      console.log('Socket ' + BoardSocketEventEnum.DISCONNECT);
      this.socket.emit(
        BoardSocketEventEnum.LEAVE_BOARD,
        this.props.match?.params.id,
      );
    });
  }

  moveObject(objectData: ObjectSocketInterface): void {
    this.setState({
      objects: this.state.objects.map(item => {
        if (item.id === objectData.data.id) {
          return {
            ...item,
            ...objectData.data,
          };
        } else {
          return item;
        }
      }),
    });
    if (objectData.id !== this.state.id) {
      this.updateShape(objectData.data, { saveHistory: true });
    }
  }

  getCanvasDimensions = (): { width: number; height: number } => {
    const width = window.innerWidth * this.props.zoomLevel;
    const height = (window.innerHeight - 80) * this.props.zoomLevel;
    return {
      width,
      height,
    };
  };

  lockObject(objectData: ObjectSocketInterface): void {
    if (objectData.id !== this.state.id) {
      this.setState({
        objects: this.state.objects.map(item => {
          if (item.id === objectData.data.id) {
            return {
              ...item,
              ...objectData.data,
            };
          } else {
            return item;
          }
        }),
      });
    }
  }

  updateObject(objectData: ObjectSocketInterface): void {
    if (objectData.id !== this.state.id) {
      this.updateShape(objectData.data, { saveHistory: true });
    }
  }

  createObject(objectData: ObjectSocketInterface): void {
    if (objectData.id !== this.state.id) {
      this.addCanvasShape(objectData.data, { saveHistory: true });
    }
  }

  deleteObject(
    objectData: ObjectSocketInterface,
    options: {
      saveHistory?: boolean;
      emitEvent?: boolean;
      saveCanvas?: boolean;
    } = {
      saveHistory: false,
      emitEvent: false,
      saveCanvas: false,
    },
  ): void {
    if (options.emitEvent) {
      this.emitSocketEvent(BoardSocketEventEnum.DELETE, objectData.data);
    }
    this.setState(
      {
        objects: this.state.objects.filter(
          shapeObject => shapeObject.id !== objectData.data.id,
        ),
      },
      () => {
        if (options.saveCanvas) {
          this.save();
        }
      },
    );
  }

  emitSocketEvent(
    eventType: BoardSocketEventEnum,
    data: ObjectInterface,
  ): void {
    const socketData = {
      boardId: this.props.match?.params.id as string,
      data: JSON.stringify({
        id: this.state.id,
        data: data,
      }),
    };
    this.socket.emit(eventType, socketData);
  }

  undoHistory(): void {
    const undoHistory = document.getElementById(
      'undo-history',
    ) as HTMLDivElement;
    undoHistory.addEventListener('click', () => {
      if (this.state.prevHistory.length) {
        const nextHistory = JSON.parse(JSON.stringify(this.state.nextHistory));
        const prevHistory = JSON.parse(JSON.stringify(this.state.prevHistory));
        const historyItem = prevHistory.pop();
        if (historyItem) {
          nextHistory.unshift(historyItem);
          this.setState({
            nextHistory,
            prevHistory,
            objects: this.state.objects.map(item => {
              if (item.id === historyItem.id) {
                return {
                  ...item,
                  ...historyItem,
                };
              } else {
                return item;
              }
            }),
          });
        }
      }
    });
  }

  redoHistory(): void {
    const redoHistory = document.getElementById(
      'redo-history',
    ) as HTMLDivElement;
    redoHistory.addEventListener('click', () => {
      if (this.state.nextHistory.length) {
        const nextHistory = JSON.parse(JSON.stringify(this.state.nextHistory));
        const prevHistory = JSON.parse(JSON.stringify(this.state.prevHistory));
        const historyItem = nextHistory.shift();
        if (historyItem) {
          prevHistory.push(historyItem);
          this.setState({
            nextHistory,
            prevHistory,
            objects: this.state.objects.map(item => {
              if (item.id === historyItem.id) {
                return {
                  ...item,
                  ...historyItem,
                };
              } else {
                return item;
              }
            }),
          });
        }
      }
    });
  }

  uploadImage(): void {
    ImageUploadingService.imageUploadFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      'canvas',
    ).subscribe(image => {
      this.setState(
        {
          canvas: {
            ...this.state.canvas,
            imageId: image.id,
          },
        },
        () => {
          this.saveCanvas();
        },
      );
    });
  }

  updateImage(): void {
    ImageUploadingService.imageUpdateFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      'canvas',
      this.state.canvas.imageId,
    ).subscribe(image => {
      this.setState({
        canvas: {
          ...this.state.canvas,
          imageId: image.id,
        },
      });
    });
  }

  saveImage(): void {
    if (!!this.state.canvas.imageId) {
      this.updateImage();
    } else {
      this.uploadImage();
    }
  }

  save(): void {
    setTimeout(() => {
      this.saveImage();
      if (!!this.state.canvas.imageId) {
        this.saveCanvas();
      }
    }, 100);
  }

  getJsonData(): string {
    return JSON.stringify(
      this.state.objects.map(item => ({
        ...item,
        isEditing: false,
        isSelected: false,
        isFocused: false,
        isLocked: false,
      })),
    );
  }

  saveCanvas(): void {
    const data = this.getJsonData();
    const canvas = {
      ...this.state.canvas,
      name: this.props.title || this.state.canvas.name,
    };
    if (!canvas.imageId) {
      delete canvas.imageId;
    }
    CanvasApiService.updateById(this.props.match?.params.id as string, {
      ...canvas,
      data: data,
    }).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error.response);
      },
    );
  }

  getCanvasObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    const canvasTitleInput = document.getElementById(
      'canvas-title-input',
    ) as HTMLInputElement;
    CanvasApiService.getById(this.props.match?.params.id as string).subscribe(
      canvasData => {
        canvasTitle.innerText = canvasData.name;
        if (canvasTitleInput) {
          canvasTitleInput.value = canvasData.name;
        }
        const canvasObjects = !!canvasData.data
          ? JSON.parse(canvasData.data)
          : [];
        this.setState(
          {
            objects: canvasObjects,
            canvas: {
              orgId: canvasData.orgId,
              name: canvasData.name,
              categoryId: canvasData.categoryId,
              imageId: canvasData.imageId as string,
            },
          },
          () => {
            this.save();
          },
        );
      },
      error => {
        console.error(error);
      },
    );
  }

  handleChangeCursor = () => {
    const container = this.stageRef?.getContent() as HTMLDivElement;
    if (container) {
      if (
        [
          'Rect',
          'RectRounded',
          'Triangle',
          'Circle',
          'Ellipse',
          'Star',
          'Sticky',
        ].includes(this.props.drawingTool as string)
      ) {
        container.style.cursor = 'crosshair';
      } else if (!this.props.drawingTool) {
        if (this.isItemFocused) {
          if (this.isItemMoving) {
            container.style.cursor = 'grabbing';
          } else {
            container.style.cursor = 'grab';
          }
        } else {
          container.style.cursor = 'auto';
        }
      }
    }
  };

  handleSelect = (data: ObjectInterface) => {
    this.updateShape(
      {
        ...data,
        isSelected: true,
      },
      {
        saveHistory: false,
        emitEvent: false,
        save: false,
      },
    );
  };

  handleLockObject = (data: ObjectInterface) => {
    this.updateShape(
      {
        ...data,
        isContextMenu: false,
        isSelected: false,
        isEditable: false,
      },
      {
        saveHistory: true,
        emitEvent: true,
        save: true,
      },
    );
  };

  handleUnlockObject = (data: ObjectInterface) => {
    this.updateShape(
      {
        ...data,
        isContextMenu: false,
        isSelected: false,
        isEditable: true,
      },
      {
        saveHistory: true,
        emitEvent: true,
        save: true,
      },
    );
  };

  handleContextMenu = (data: ObjectInterface) => {
    this.updateShape(
      {
        ...data,
        isContextMenu: true,
      },
      {
        saveHistory: false,
        emitEvent: false,
        save: false,
      },
    );
  };

  handleMouseDown = e => {
    if (this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      const data: ObjectInterface = onMouseDown(
        { ...this.state.points },
        this.props.drawingTool,
        position,
        uuidv4(),
      );

      this.isDrawing = true;
      this.setState({
        points: _.cloneDeep(data),
      });
    }
  };

  handleMouseMove = e => {
    if (this.isDrawing && this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      const data: ObjectInterface = onMouseMove(
        { ...this.state.points },
        this.props.drawingTool,
        position,
      );

      this.setState({
        points: _.cloneDeep(data),
      });
    }
  };

  handleMouseUp = e => {
    if (this.isDrawing) {
      this.isDrawing = false;
      const position = e.target.getStage().getPointerPosition();
      const data = onMouseUp(
        { ...this.state.points },
        this.props.drawingTool,
        position,
      );
      this.addCanvasShape(data, {
        saveHistory: true,
        emitEvent: true,
      });

      this.setState({
        points: {
          ...defaultObjectState,
        },
      });
    } else {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        this.setState({
          objects: this.state.objects.map(item => ({
            ...item,
            isSelected: false,
            isFocused: false,
            isEditing: false,
            isContextMenu: false,
          })),
        });
      }
    }
  };

  addCanvasShape = (
    data: ObjectInterface,
    options: { saveHistory?: boolean; emitEvent?: boolean } = {
      saveHistory: false,
      emitEvent: false,
    },
  ) => {
    console.log('addCanvasShape', data, options);
    if (options.saveHistory) {
      this.updateHistory(JSON.parse(JSON.stringify(data)));
    }
    if (options.emitEvent) {
      this.emitSocketEvent(BoardSocketEventEnum.CREATE, {
        ...data,
        isEditing: false,
        isSelected: false,
        isFocused: false,
        isLocked: false,
        isContextMenu: false,
      });
    }
    this.setState(
      {
        objects: [
          ...this.state.objects.map(shapeObject => ({
            ...shapeObject,
            isEditing: false,
            isSelected: false,
            isFocused: false,
            isContextMenu: false,
          })),
          {
            ..._.cloneDeep(data),
          },
        ],
      },
      () => {
        this.save();
      },
    );
  };

  updateHistory(data: ObjectInterface) {
    this.setState({
      prevHistory: [
        ...this.state.prevHistory,
        { ...data, isEditing: false, isSelected: false, isFocused: false },
      ],
      nextHistory: [],
    });
  }

  updateShape(
    data: ObjectInterface,
    options: { saveHistory?: boolean; emitEvent?: boolean; save?: boolean } = {
      saveHistory: false,
      emitEvent: false,
      save: true,
    },
  ) {
    if (options.saveHistory) {
      const historyItem = this.state.objects.find(item => item.id === data.id);
      if (historyItem) {
        const history = JSON.parse(JSON.stringify(historyItem));
        this.updateHistory({
          ...history,
        });
      }
    }

    const item = this.state.objects.find(item => item.id === data.id);
    if (options.emitEvent) {
      this.emitSocketEvent(BoardSocketEventEnum.UPDATE, {
        ...item,
        ...data,
        isSelected: false,
        isEditing: false,
        isFocused: false,
        isLocked: false,
        isContextMenu: false,
      });
    }

    const objects = this.state.objects
      .filter(item => item.id !== data.id)
      .map(shapeObject => ({
        ...shapeObject,
        isSelected: false,
        isEditing: false,
        isFocused: false,
        isLocked: false,
        isContextMenu: false,
      }));

    this.setState(
      {
        objects: [...objects, { ...item, ...data }],
      },
      () => {
        if (options.save) {
          this.save();
        }
      },
    );
  }

  updateObjectText(id: string, data: StickyProperty): void {
    const object = this.state.objects.find(item => item.id === id);
    if (object) {
      this.updateShape(
        {
          ...object,
          sticky: {
            ...data,
          },
        },
        {
          saveHistory: true,
          emitEvent: true,
          save: true,
        },
      );
    }
  }

  updateObjectColor(
    data: ObjectInterface,
    shapeConfig: Konva.ShapeConfig,
  ): void {
    const object = this.state.objects.find(item => item.id === data.id);
    if (object) {
      object.shapeConfig = {
        ...object.shapeConfig,
        ...shapeConfig,
      };
      this.updateShape(
        {
          ...object,
        },
        {
          saveHistory: true,
          emitEvent: true,
          save: true,
        },
      );
    }
  }

  getLineGuideStops(
    skipShape: any,
  ): {
    vertical: number[];
    horizontal: number[];
  } {
    // we can snap to stage borders and the center of the stage
    const vertical: any[] = [
      0,
      (this.stageRef?.width() as number) / 2,
      this.stageRef?.width() as number,
    ];
    const horizontal: any[] = [
      0,
      (this.stageRef?.height() as number) / 2,
      this.stageRef?.height() as number,
    ];

    // and we snap over edges and center of each object on the canvas
    this.stageRef?.find('.object')?.each(guideItem => {
      if (guideItem === skipShape) {
        return;
      }
      const box = guideItem.getClientRect();
      // and we can snap to all edges of shapes
      vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
      horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });

    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  }

  getGuides(
    lineGuideStops: {
      vertical: number[];
      horizontal: number[];
    },
    itemBounds: ObjectSnappingEdges,
  ): ObjectSnappingGuide[] {
    const resultV: ObjectSnappingResult[] = [];
    const resultH: ObjectSnappingResult[] = [];

    lineGuideStops.vertical.forEach(lineGuide => {
      itemBounds.vertical.forEach(itemBound => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        // if the distance between guild line and object snap point is close we can consider this for snapping
        if (diff < this.GUIDELINE_OFFSET) {
          resultV.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    lineGuideStops.horizontal.forEach(lineGuide => {
      itemBounds.horizontal.forEach(itemBound => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        if (diff < this.GUIDELINE_OFFSET) {
          resultH.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    const guides: ObjectSnappingGuide[] = [];

    // find closest snap
    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        offset: minV.offset,
        orientation: 'V',
        snap: minV.snap,
      });
    }
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        offset: minH.offset,
        orientation: 'H',
        snap: minH.snap,
      });
    }
    return guides;
  }

  drawGuides(guides: ObjectSnappingGuide[]) {
    const layer = this.layerRef as Konva.Layer;
    guides.forEach(lg => {
      let line;
      if (lg.orientation === 'H') {
        line = new Konva.Line({
          points: [-6000, 0, 6000, 0],
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6],
        });
        layer.add(line);
        line.absolutePosition({
          x: 0,
          y: lg.lineGuide,
        });
        layer.batchDraw();
      } else if (lg.orientation === 'V') {
        line = new Konva.Line({
          points: [0, -6000, 0, 6000],
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6],
        });
        layer.add(line);
        line.absolutePosition({
          x: lg.lineGuide,
          y: 0,
        });
        layer.batchDraw();
      }
    });
  }

  destroyGuides = () => {
    const layer = this.layerRef as Konva.Layer;
    layer.find('.guid-line').each(guideItem => {
      guideItem.destroy();
    });
  };

  handleChanging = (target: any, itemBounds: ObjectSnappingEdges) => {
    const layer = this.layerRef as Konva.Layer;
    this.destroyGuides();
    const lineGuideStops = this.getLineGuideStops(target);
    const guides = this.getGuides(lineGuideStops, itemBounds);
    if (!guides.length) {
      return;
    }
    this.drawGuides(guides);
    var absPos = (target as Konva.Node).absolutePosition();
    guides.forEach(lg => {
      switch (lg.snap) {
        case 'start': {
          switch (lg.orientation) {
            case 'V': {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case 'H': {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
        case 'center': {
          switch (lg.orientation) {
            case 'V': {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case 'H': {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
        case 'end': {
          switch (lg.orientation) {
            case 'V': {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case 'H': {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
      }
    });
    target.absolutePosition(absPos);
  };

  handleChangeStart = (data: ObjectInterface) => {
    console.log(data);
    this.emitSocketEvent(BoardSocketEventEnum.LOCK, {
      ...data,
      isSelected: false,
      isLocked: true,
      isEditing: false,
      isFocused: false,
    });
  };

  render() {
    console.log('props', this.props);
    return (
      <div className={this.props.className}>
        {this.state.objects
          .filter(shapeObject => shapeObject.isContextMenu)
          .map(shapeObject => (
            <div
              className="context-menu"
              style={{
                left: this.state.pointerPosition.x,
                top: this.state.pointerPosition.y,
              }}
            >
              {shapeObject.isEditable && (
                <>
                  <div
                    className="context-menu-item"
                    onClick={() => {
                      this.handleLockObject(shapeObject);
                    }}
                  >
                    Lock
                  </div>
                  <div
                    className="context-menu-item"
                    onClick={() => {
                      this.deleteObject(
                        {
                          id: this.state.id,
                          data: shapeObject,
                        },
                        {
                          saveHistory: true,
                        },
                      );
                    }}
                  >
                    Delete
                  </div>
                </>
              )}

              {!shapeObject.isEditable && (
                <div
                  className="context-menu-item"
                  onClick={() => {
                    this.handleUnlockObject(shapeObject);
                  }}
                >
                  Unlock
                </div>
              )}
            </div>
          ))}
        {this.state.objects
          .filter(
            shapeObject =>
              (shapeObject.type === 'Sticky' || shapeObject.type === 'Text') &&
              shapeObject.isEditing &&
              !this.isItemMoving,
          )
          .map(shapeObject => {
            const getFontWeight = (): 'normal' | 'bold' => {
              let fontWeight: 'normal' | 'bold' = 'normal';
              if (shapeObject.sticky?.fontStyle) {
                if (
                  shapeObject.sticky?.fontStyle === 'normal' ||
                  shapeObject.sticky?.fontStyle === 'bold'
                ) {
                  fontWeight = shapeObject.sticky?.fontStyle;
                }
              }
              return fontWeight;
            };
            return (
              <p
                key={shapeObject.id + ':Text-Edit'}
                style={{
                  position: 'absolute',
                  left: shapeObject.x * this.props.zoomLevel,
                  top: shapeObject.y * this.props.zoomLevel,
                  width: shapeObject.rect?.width + 'px',
                  height: shapeObject.rect?.height + 'px',
                  fontSize: shapeObject.sticky?.fontSize + 'px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10000,
                  color: shapeObject.sticky?.fontColor,
                  fontWeight: getFontWeight(),
                  textDecorationLine: shapeObject.sticky?.textDecoration,
                  fontStyle:
                    shapeObject.sticky?.fontStyle === 'italic'
                      ? 'italic'
                      : 'normal',
                  fontFamily: shapeObject.sticky?.fontFamily,
                }}
                id="canvas-text-editor"
                contentEditable="true"
                onBlur={event => {
                  console.log(event);
                  this.updateObjectText(shapeObject.id, {
                    ...shapeObject.sticky,
                    text: event.currentTarget.innerText,
                  });
                }}
              >
                {shapeObject.sticky?.text}
              </p>
            );
          })}
        {this.state.objects
          .filter(
            shapeObject =>
              (shapeObject.type === 'Sticky' || shapeObject.type === 'Text') &&
              shapeObject.isSelected &&
              !this.isItemMoving,
          )
          .map(shapeObject => (
            <div
              key={shapeObject.id + ':toolbar'}
              className="canvas-text-toolbar"
              style={{
                left: shapeObject.x * this.props.zoomLevel,
                top: shapeObject.y * this.props.zoomLevel,
              }}
            >
              <div className="canvas-text-toolbar-item">
                <Select
                  defaultValue={shapeObject.sticky?.fontFamily}
                  style={{ width: 120, paddingLeft: '10px' }}
                  suffixIcon={<ChevronDownIcon />}
                  onChange={value => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontFamily: value,
                    });
                  }}
                >
                  {fontNames.map(font => (
                    <Select.Option
                      key={font}
                      value={font}
                      style={{
                        fontFamily: font,
                      }}
                    >
                      {font}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <MinusSquareIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontSize: Math.max(
                        10,
                        (shapeObject.sticky?.fontSize as number) - 1,
                      ),
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                {shapeObject.sticky?.fontSize}
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <PlusSquareIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontSize: Math.min(
                        30,
                        (shapeObject.sticky?.fontSize as number) + 1,
                      ),
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextAlignmentIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextBoldIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontStyle:
                        shapeObject.sticky?.fontStyle === 'bold'
                          ? 'normal'
                          : 'bold',
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextUnderLineIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      textDecoration:
                        shapeObject.sticky?.textDecoration === 'underline'
                          ? ''
                          : 'underline',
                    });
                  }}
                />
              </div>
              <label className="canvas-text-toolbar-item action-button">
                <TextColorIcon
                  style={{
                    color: shapeObject.sticky?.fontColor,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontColor: event.target.value,
                    });
                  }}
                  value={shapeObject.sticky?.fontColor}
                />
              </label>
              <div className="canvas-text-toolbar-item action-button">
                <MarkerIcon />
              </div>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <label className="canvas-text-toolbar-item action-button">
                <BorderStyleIcon
                  style={{
                    color: shapeObject.sticky?.stroke,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      stroke: event.target.value,
                    });
                  }}
                  value={shapeObject.sticky?.stroke}
                />
              </label>
              <label className="canvas-text-toolbar-item action-button">
                <FillColorIcon
                  style={{
                    color: shapeObject.sticky?.backgroundColor,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      backgroundColor: event.target.value,
                    });
                  }}
                  value={shapeObject.sticky?.backgroundColor}
                />
              </label>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>

              <Dropdown
                className="canvas-text-toolbar-item action-button action-more"
                overlay={
                  <Menu>
                    <Menu.Item
                      onClick={() => {
                        this.deleteObject(
                          {
                            id: shapeObject.id,
                            data: shapeObject,
                          },
                          {
                            saveHistory: true,
                            saveCanvas: true,
                            emitEvent: true,
                          },
                        );
                      }}
                      key="1"
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <MoreIcon />
              </Dropdown>
            </div>
          ))}

        {this.state.objects
          .filter(
            shapeObject =>
              shapeObject.type !== 'Sticky' &&
              shapeObject.type !== 'Text' &&
              shapeObject.isSelected &&
              !this.isItemMoving,
          )
          .map(shapeObject => (
            <div
              key={shapeObject.id + ':toolbar'}
              className="canvas-text-toolbar"
              style={{
                left: shapeObject.x * this.props.zoomLevel,
                top: shapeObject.y * this.props.zoomLevel,
              }}
            >
              <div className="canvas-text-toolbar-item action-button">
                <MinusSquareIcon
                  onClick={() => {
                    this.updateObjectColor(shapeObject, {
                      opacity: +Math.max(
                        0.1,
                        (shapeObject.shapeConfig?.opacity as number) - 0.1,
                      ).toFixed(1),
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                {Math.abs(
                  ((shapeObject.shapeConfig?.opacity as number) || 0) * 10,
                )}
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <PlusSquareIcon
                  onClick={() => {
                    this.updateObjectColor(shapeObject, {
                      opacity: +Math.min(
                        1,
                        (shapeObject.shapeConfig?.opacity as number) + 0.1,
                      ).toFixed(1),
                    });
                  }}
                />
              </div>
              <label className="canvas-text-toolbar-item action-button">
                <BorderStyleIcon
                  style={{
                    color: shapeObject.shapeConfig?.stroke,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectColor(shapeObject, {
                      stroke: event.target.value,
                    });
                  }}
                  value={shapeObject.shapeConfig?.stroke}
                />
              </label>
              {shapeObject.type !== 'Line' && (
                <label className="canvas-text-toolbar-item action-button">
                  <FillColorIcon
                    style={{
                      color: shapeObject.shapeConfig?.fill,
                    }}
                  />
                  <input
                    type="color"
                    hidden={true}
                    onChange={event => {
                      this.updateObjectColor(shapeObject, {
                        fill: event.target.value,
                      });
                    }}
                    value={shapeObject.shapeConfig?.fill}
                  />
                </label>
              )}
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <Dropdown
                className="canvas-text-toolbar-item action-button action-more"
                overlay={
                  <Menu>
                    <Menu.Item
                      onClick={() => {
                        this.deleteObject(
                          {
                            id: shapeObject.id,
                            data: shapeObject,
                          },
                          {
                            saveHistory: true,
                            saveCanvas: true,
                            emitEvent: true,
                          },
                        );
                      }}
                      key="1"
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <MoreIcon />
              </Dropdown>
            </div>
          ))}

        <Stage
          width={window.innerWidth * this.props.zoomLevel}
          height={(window.innerHeight - 80) * this.props.zoomLevel}
          className="canvas-body-content"
          ref={ref => (this.stageRef = ref)}
          onMouseDown={this.handleMouseDown}
          onMousemove={this.handleMouseMove}
          onMouseup={this.handleMouseUp}
          onContextMenu={event => {
            event.evt.preventDefault();
            event.evt.stopPropagation();
            this.setState({
              pointerPosition: {
                x: event.evt.x,
                y: event.evt.y - 40,
              },
            });
          }}
          scale={{
            x: this.props.zoomLevel,
            y: this.props.zoomLevel,
          }}
        >
          <Layer ref={ref => (this.layerRef = ref)}>
            {this.state.objects.map(shapeObject => {
              if (
                shapeObject.type === 'Rect' ||
                shapeObject.type === 'RectRounded'
              ) {
                return (
                  <RectTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onChange={data => {
                      this.destroyGuides();
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                        save: true,
                      });
                    }}
                    onSelect={() => {
                      if (shapeObject.isEditable) {
                        this.handleSelect(shapeObject);
                      }
                    }}
                    onContextMenu={() => {
                      this.handleContextMenu(shapeObject);
                    }}
                  />
                );
              } else if (shapeObject.type === 'Ellipse') {
                return (
                  <>
                    <EllipseTransform
                      key={shapeObject.id}
                      data={shapeObject}
                      onChangeStart={this.handleChangeStart}
                      onChanging={this.handleChanging}
                      onChange={data => {
                        this.destroyGuides();
                        this.updateShape(data, {
                          saveHistory: true,
                          emitEvent: true,
                          save: true,
                        });
                      }}
                      onSelect={() => {
                        if (shapeObject.isEditable) {
                          this.handleSelect(shapeObject);
                        }
                      }}
                      onContextMenu={() => {
                        this.handleContextMenu(shapeObject);
                      }}
                    />
                  </>
                );
              } else if (shapeObject.type === 'Star') {
                return (
                  <>
                    <StarTransform
                      key={shapeObject.id}
                      data={shapeObject}
                      onChangeStart={this.handleChangeStart}
                      onChanging={this.handleChanging}
                      onChange={data => {
                        this.destroyGuides();
                        this.updateShape(data, {
                          saveHistory: true,
                          emitEvent: true,
                          save: true,
                        });
                      }}
                      onSelect={() => {
                        if (shapeObject.isEditable) {
                          this.handleSelect(shapeObject);
                        }
                      }}
                      onContextMenu={() => {
                        this.handleContextMenu(shapeObject);
                      }}
                    />
                  </>
                );
              } else if (shapeObject.type === 'Triangle') {
                return (
                  <TriangleTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onChange={data => {
                      this.destroyGuides();
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                        save: true,
                      });
                    }}
                    onSelect={() => {
                      if (shapeObject.isEditable) {
                        this.handleSelect(shapeObject);
                      }
                    }}
                    onContextMenu={() => {
                      this.handleContextMenu(shapeObject);
                    }}
                  />
                );
              } else if (
                shapeObject.type === 'Text' ||
                shapeObject.type === 'Sticky'
              ) {
                return (
                  <StickyTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onEdit={data => {
                      this.updateShape(data);
                    }}
                    onChange={data => {
                      this.destroyGuides();
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                        save: true,
                      });
                    }}
                    onSelect={() => {
                      if (shapeObject.isEditable) {
                        this.handleSelect(shapeObject);
                      }
                    }}
                    onContextMenu={() => {
                      this.handleContextMenu(shapeObject);
                    }}
                  />
                );
              } else if (shapeObject.type === 'Line') {
                return (
                  <LineTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onChange={data => {
                      this.destroyGuides();
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                        save: true,
                      });
                    }}
                    onSelect={() => {
                      if (shapeObject.isEditable) {
                        this.handleSelect(shapeObject);
                      }
                    }}
                    onContextMenu={() => {
                      this.handleContextMenu(shapeObject);
                    }}
                  />
                );
              } else {
                return <></>;
              }
            })}

            {(this.props.drawingTool === 'Text' ||
              this.props.drawingTool === 'Sticky') &&
              this.isDrawing && (
                <Group
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.rect?.width as number}
                  height={this.state.points.rect?.height as number}
                >
                  <Rect
                    x={0}
                    y={0}
                    width={this.state.points.rect?.width as number}
                    height={this.state.points.rect?.height as number}
                    stroke="#000000"
                    dash={[10, 10]}
                    fill={
                      this.props.drawingTool === 'Sticky'
                        ? '#f5ecfd'
                        : undefined
                    }
                  />
                  <Text
                    x={0}
                    y={0}
                    width={this.state.points.rect?.width as number}
                    height={this.state.points.rect?.height as number}
                    align="center"
                    verticalAlign="middle"
                    fill={
                      this.props.drawingTool === 'Text' ? '#bebebe' : '#000000'
                    }
                    text={
                      this.props.drawingTool === 'Text'
                        ? 'Type something here'
                        : 'Sticky notes area'
                    }
                  />
                </Group>
              )}

            {this.props.drawingTool === 'Star' && this.isDrawing && (
              <Star
                numPoints={this.state.points.star?.numPoints as number}
                innerRadius={this.state.points.star?.innerRadius as number}
                outerRadius={this.state.points.star?.outerRadius as number}
                x={this.state.points.x}
                y={this.state.points.y}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}
            {this.props.drawingTool === 'Triangle' && this.isDrawing && (
              <Shape
                x={this.state.points.x}
                y={this.state.points.y}
                sceneFunc={(context, shape) => {
                  context.beginPath();
                  context.moveTo(
                    (this.state.points.triangle?.width as number) / 2,
                    0,
                  );
                  context.lineTo(
                    0,
                    this.state.points.triangle?.height as number,
                  );
                  context.lineTo(
                    this.state.points.triangle?.width as number,
                    this.state.points.triangle?.height as number,
                  );
                  context.closePath();
                  // (!) Konva specific method, it is very important
                  context.fillStrokeShape(shape);
                }}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}

            {this.props.drawingTool === 'Ellipse' && this.isDrawing && (
              <Ellipse
                x={this.state.points.x}
                y={this.state.points.y}
                radiusX={this.state.points.ellipse?.radiusX as number}
                radiusY={this.state.points.ellipse?.radiusY as number}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}

            {(this.props.drawingTool === 'Rect' ||
              this.props.drawingTool === 'RectRounded') &&
              this.isDrawing && (
                <Rect
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.rect?.width as number}
                  height={this.state.points.rect?.height as number}
                  cornerRadius={this.state.points.rect?.cornerRadius as number}
                  stroke="#000000"
                  dash={[10, 10]}
                  {...{
                    shadowBlur: 10,
                    shadowOpacity: 0.6,
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
                  }}
                />
              )}

            {this.props.drawingTool === 'Line' && this.isDrawing && (
              <>
                <Line
                  x={this.state.points.x}
                  y={this.state.points.y}
                  points={(() => {
                    const points: number[] = [];
                    this.state.points.line?.forEach(point => {
                      points.push(point.x);
                      points.push(point.y);
                    });
                    return points;
                  })()}
                  stroke="#000000"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                />
              </>
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default DrawCanvas;
