import React, { PureComponent } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import {
  ObjectInterface,
  ObjectSocketInterface,
  Props,
  State,
  StickyProperty,
} from './types';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import { defaultObjectState } from './constants';

import {
  EllipseTransform,
  LineTransform,
  RectTransform,
  StarTransform,
  StickyTransform,
  TriangleTransform,
} from './components';

import {
  BoardApiService,
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

class DrawBoard extends PureComponent<Props, State> {
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
    selectedStickyData: null,
  };
  stageRef: Konva.Stage | null = null;
  textAreaRef = React.createRef<HTMLTextAreaElement>();

  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;

  constructor(props) {
    super(props);
    const url = new URL(process.env.REACT_APP_BASE_URL as string);
    url.pathname = 'board';
    this.socket = socketIOClient(url.href, {
      transports: ['websocket'],
    });
  }

  componentDidMount() {
    console.log('dsadasdasda');
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
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
    });

    this.redoHistory();
    this.undoHistory();

    const saveCanvas = document.getElementById('save-canvas') as HTMLDivElement;
    saveCanvas.addEventListener('click', () => {
      this.save();
    });
    this.getData();
    this.canvasWebSockets();
  }

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
    // this.socket.on(BoardSocketEventEnum.DELETE, (event: string) => {
    //   console.log('Socket ' + BoardSocketEventEnum.DELETE, event);
    //   this.deleteObject(JSON.parse(event), { saveHistory: true });
    // });
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

  // deleteObject(
  //   objectData: ObjectSocketInterface,
  //   options: {
  //     saveHistory?: boolean;
  //     emitEvent?: boolean;
  //     saveCanvas?: boolean;
  //   } = {
  //     saveHistory: false,
  //     emitEvent: false,
  //     saveCanvas: false,
  //   },
  // ): void {
  //   if (options.emitEvent) {
  //     this.emitSocketEvent(BoardSocketEventEnum.DELETE, objectData.data);
  //   }
  //   this.setState(
  //     {
  //       objects: this.state.objects.filter(
  //         shapeObject => shapeObject.id !== objectData.data.id,
  //       ),
  //     },
  //     () => {
  //       if (options.saveCanvas) {
  //         this.save();
  //       }
  //     },
  //   );
  // }

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
      'board',
    ).subscribe(image => {
      this.setState(
        {
          canvas: {
            ...this.state.canvas,
            imageId: image.id,
          },
        },
        () => {
          this.saveBoard();
        },
      );
    });
  }

  updateImage(): void {
    ImageUploadingService.imageUpdateFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      'board',
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
    this.saveImage();
    if (!!this.state.canvas.imageId) {
      this.saveBoard();
    }
  }

  getJsonData(): string {
    return JSON.stringify(
      this.state.objects.map(item => ({
        ...item,
        isEditing: false,
        isSelected: false,
        isFocused: false,
        isLocked: true,
      })),
    );
  }

  saveBoard(): void {
    const data = this.getJsonData();
    const canvas = {
      ...this.state.canvas,
      name: this.props.title || this.state.canvas.name,
    };
    if (!canvas.imageId) {
      delete canvas.imageId;
    }
    BoardApiService.updateById(this.props.match?.params.id as string, {
      ...canvas,
      data: data,
    }).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      },
    );
  }

  getData(): void {
    this.getBoardObject();
  }

  getBoardObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    const canvasTitleInput = document.getElementById(
      'canvas-title-input',
    ) as HTMLInputElement;
    BoardApiService.getById(this.props.match?.params.id as string).subscribe(
      boardData => {
        canvasTitle.innerText = boardData.name;
        if (canvasTitleInput) {
          canvasTitleInput.value = boardData.name;
        }
        const canvasObjects = !!boardData.data
          ? JSON.parse(boardData.data)
          : [];
        this.setState(
          {
            objects: canvasObjects,
            canvas: {
              orgId: boardData.orgId,
              name: boardData.name,
              categoryId: boardData.categoryId as string,
              imageId: boardData.imageId as string,
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

  handleSelect = (data: ObjectInterface) => {
    this.updateShape({
      ...data,
      isSelected: false,
    });
  };

  handleMouseDown = e => {
    if (this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      const data: ObjectInterface = onMouseDown(
        { ...this.state.points },
        this.props.drawingTool,
        position,
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
    options: { saveHistory?: boolean; emitEvent?: boolean } = {
      saveHistory: false,
      emitEvent: false,
    },
  ) {
    if (data.type !== 'Sticky') {
      return;
    }
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
        isLocked: true,
      });
    }
    const objects = this.state.objects
      .filter(item => item.id !== data.id)
      .map(shapeObject => ({
        ...shapeObject,
        isSelected: false,
        isEditing: false,
        isFocused: false,
        isLocked: true,
      }));

    this.setState(
      {
        objects: [...objects, { ...item, ...data }],
      },
      () => {
        this.save();
      },
    );
  }

  updateObjectText(id: string, data: StickyProperty): void {
    const object = this.state.objects.find(item => item.id === id);
    console.log('object', object);
    if (object) {
      this.updateShape(
        {
          ...object,
          isEditing: false,
          sticky: {
            ...data,
          },
        },
        {
          saveHistory: true,
          emitEvent: true,
        },
      );
    }
  }

  handleChanging = (data: ObjectInterface) => {
    // this.emitSocketEvent(BoardSocketEventEnum.MOVE, data);
  };

  handleChangeStart = (data: ObjectInterface) => {
    console.log(data, 'handleChangeStart');
    this.emitSocketEvent(BoardSocketEventEnum.LOCK, {
      ...data,
      isSelected: false,
      isLocked: true,
      isEditing: false,
      isFocused: false,
    });
  };

  render() {
    console.log('this.state.selectedStickyData', this.state.selectedStickyData);
    return (
      <div className={this.props.className}>
        <Stage
          width={window.innerWidth * this.props.zoomLevel}
          height={(window.innerHeight - 80) * this.props.zoomLevel}
          className="canvas-body-content"
          ref={ref => (this.stageRef = ref)}
          // onMouseDown={this.handleMouseDown}
          // onMousemove={this.handleMouseMove}
          // onMouseup={this.handleMouseUp}
          scale={{
            x: this.props.zoomLevel,
            y: this.props.zoomLevel,
          }}
        >
          <Layer>
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
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
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
                        this.updateShape(data, {
                          saveHistory: true,
                          emitEvent: true,
                        });
                      }}
                      onSelect={() => {
                        this.handleSelect(shapeObject);
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
                        this.updateShape(data, {
                          saveHistory: true,
                          emitEvent: true,
                        });
                      }}
                      onSelect={() => {
                        this.handleSelect(shapeObject);
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
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
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
                      this.setState({ selectedStickyData: data });
                    }}
                    onChange={data => {
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
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
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              } else {
                return <></>;
              }
            })}
          </Layer>
        </Stage>
        {!!this.state.selectedStickyData && (
          <textarea
            ref={this.textAreaRef}
            style={{
              ...this.state.selectedStickyData.textData,
              position: 'absolute',
              top: this.state.selectedStickyData?.y,
              left: this.state.selectedStickyData?.x,
              width: this.state.selectedStickyData.rect?.width,
              height: this.state.selectedStickyData.rect?.height,
              resize: 'none',
              color: '#000000',
              background: '#F5EDFE',
              // borderRadius: this.state.selectedStickyData?.sticky?.cornerRadius,
              padding: '15px 5px',
              outline: 'none',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && this.state.selectedStickyData) {
                this.updateObjectText(this.state.selectedStickyData.id, {
                  ...this.state.selectedStickyData.sticky,
                  text: this.textAreaRef.current?.value,
                });
                this.setState({
                  selectedStickyData: null,
                });
              }
            }}
            // className="canvas-text-editor"
            id="canvas-text-editor"
            contentEditable="true"
            defaultValue={this.state.selectedStickyData.sticky?.text}
          ></textarea>
        )}
      </div>
    );
  }
}

export default DrawBoard;
