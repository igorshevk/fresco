import React, { memo, useEffect, useRef, useState } from 'react';
import { RouteChildrenProps, useLocation } from 'react-router';
import logoImg from 'assets/icons/logo-color.svg';
import { v4 as uuidv4 } from 'uuid';

import { Button, Dropdown, Input, Menu, Slider, Switch } from 'antd';
import {
  CheckOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { DrawCanvas } from '../../components/DrawCanvas';
import {
  CircleShapeIcon,
  CursorIcon,
  RectangleShapeIcon,
  RedoIcon,
  RoundedRectangleShapeIcon,
  ShapesIcon,
  StarShapeIcon,
  StickyNoteIcon,
  TextIcon,
  TriangleShapeIcon,
  UndoIcon,
  VerticalLineIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../../components/CanvasIcons';
import clsx from 'clsx';
import pageIcon from '../../../assets/icons/page.svg';
import { Link, useHistory } from 'react-router-dom';
import { ShareModal } from 'app/components/ShareModal';
import { PERMISSION } from '../Dashboard';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { invitationType } from 'utils/constant';

interface IState {
  orgId?: any;
}

export const CreateCanvas = (props: RouteChildrenProps<{ id: string }>) => {
  const [zoom, setZoom] = useState<number>(0);
  const [drawingTool, setDrawingTool] = useState<
    | 'Rect'
    | 'RectRounded'
    | 'Triangle'
    | 'Ellipse'
    | 'Star'
    | 'Text'
    | 'Sticky'
    | 'Line'
    | null
  >(null);
  const [showSubTools, setShowSubTools] = useState<string>('');
  const [showInputTitle, setShowInputTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>('');
  const [isShowShareModal, setIsShowShareModal] = useState(false);
  const [permission, setPermission] = useState(PERMISSION.EDITOR);
  const [linkInvitation, setLinkInvitation] = useState(Object);
  const location = useLocation();
  const orgId = (location.state as IState)?.orgId;
  const token = useSelector(selectToken);
  const canvasId = props?.match?.params?.id;
  useEffect(() => {
    document.addEventListener('click', event => {
      const target = event.target as Node;
      const toolbar = document.getElementById(
        'canvas-toolbar',
      ) as HTMLDivElement;
      if (toolbar) {
        if (!toolbar.contains(target)) {
          setShowSubTools('');
        }
      }
    });
  }, []);

  useEffect(() => {
    const shareIcon = document.getElementById('share-icon') as HTMLDivElement;
    if (shareIcon) {
      shareIcon.addEventListener('click', () => {
        setIsShowShareModal(true);
      });
    }
  }, []);

  const _getLinkInvitation = async () => {
    try {
      let res;
      try {
        res = await Axios.request({
          method: 'GET',
          url: process.env.REACT_APP_BASE_URL + 'invitation-type',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            typeId: canvasId,
            orgId: orgId,
            type: invitationType.CANVAS,
          },
        });
      } catch (e) {
        console.log(e);
      }

      if (res?.data?.length) {
        setLinkInvitation(res.data[0]);
        setPermission(res?.data[0]?.permission);
      } else {
        const resCreated = await Axios.request({
          method: 'POST',
          url: process.env.REACT_APP_BASE_URL + 'invitation-type',
          data: {
            orgId: orgId,
            token: uuidv4(),
            permission: PERMISSION.EDITOR,
            type: invitationType.CANVAS,
            typeId: canvasId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('resCreated', resCreated);
        setLinkInvitation(resCreated?.data);
        setPermission(resCreated?.data?.permission);
      }
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    if (canvasId && token) {
      _getLinkInvitation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasId, token]);

  const _onChangePermission = async e => {
    // console.log(e, linkInvitation);
    setPermission(e.key);
    const resUpdated = await Axios.request({
      method: 'PUT',
      url: `${process.env.REACT_APP_BASE_URL}invitation-type/${linkInvitation.id}/${invitationType.CANVAS}`,
      data: {
        permission: e.key,
        type: invitationType.CANVAS,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('resUpdated', resUpdated);
    setLinkInvitation(resUpdated?.data);
  };

  const _closeModal = () => {
    setIsShowShareModal(false);
  };

  const handleKeyDown = async event => {
    if (event.key === 'Enter') {
      const canvasTitleInput = document.getElementById(
        'canvas-title-input',
      ) as HTMLInputElement;
      setTitle(canvasTitleInput.value);
      const objState = props.location.state as any;
      await Axios.request({
        method: 'PUT',
        url: `${process.env.REACT_APP_BASE_URL}canvas/${canvasId}`,
        data: {
          name: canvasTitleInput.value,
          orgId: objState.orgId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowInputTitle(false);
      setImmediate(() => {
        const canvasTitle = document.getElementById(
          'canvas-title',
        ) as HTMLDivElement;
        canvasTitle.innerText = canvasTitleInput.value || '';
      });
    }
  };

  const handleDoubleClick = _event => {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLDivElement;
    setShowInputTitle(true);
    setImmediate(() => {
      const canvasTitleInput = document.getElementById(
        'canvas-title-input',
      ) as HTMLInputElement;
      canvasTitleInput.value = canvasTitle.textContent || '';
      setTitle(canvasTitle.textContent);
    });
  };

  return (
    <div className="canvas-view">
      <div className="canvas-editor">
        {isShowShareModal && (
          <ShareModal
            permission={permission}
            onChangePermission={_onChangePermission}
            linkInvitation={linkInvitation}
            closeModal={_closeModal}
            orgId={orgId}
            typeId={canvasId}
            type={invitationType.CANVAS}
          />
        )}
        <DrawCanvas
          className="canvas-body"
          drawingTool={drawingTool}
          zoomLevel={zoom / 100 + 1}
          title={title}
          {...props}
        />
        <div className="canvas-header">
          <div className="canvas-header-left">
            <Link to={`/organization/${orgId}`} className="canvas-header-logo">
              <img src={logoImg} alt="logo" />
            </Link>
            {!showInputTitle ? (
              <div
                onDoubleClick={handleDoubleClick}
                className="canvas-header-title"
                id="canvas-title"
              ></div>
            ) : (
              <input
                type="text"
                id="canvas-title-input"
                className="canvas-title-input"
                onKeyDown={handleKeyDown}
              />
            )}
            <div className="canvas-header-actions">
              <div className="canvas-header-action-item" id="undo-history">
                <UndoIcon />
              </div>
              <div className="canvas-header-action-item" id="redo-history">
                <RedoIcon />
              </div>
            </div>
          </div>
          <div className="canvas-header-right">
            <Dropdown.Button
              trigger={['click']}
              overlay={
                <Menu className="canvas-dropdown">
                  <div className="dropdown-item">
                    <CheckOutlined /> Published
                  </div>
                  <div className="dropdown-item">
                    <img src={pageIcon} alt="page" /> Publish & Create Canvas
                  </div>
                  <div className="switch-item">
                    Public URL <Switch defaultChecked />
                  </div>
                  <div className="input-item">
                    <Input
                      addonAfter={<CopyOutlined />}
                      defaultValue="https://example.org"
                    />
                  </div>
                </Menu>
              }
            >
              <span
                id="save-canvas"
                onClick={() => {
                  window.location.href = `/organization/${orgId}`;
                }}
              >
                Publish
              </span>
            </Dropdown.Button>
            <Button id="share-icon" style={{ marginLeft: 30, marginRight: 16 }}>
              <ShareAltOutlined />
            </Button>
          </div>
        </div>

        <div className="canvas-toolbar" id="canvas-toolbar">
          <div
            className={clsx(
              'canvas-toolbar-item',
              drawingTool === 'Sticky' && 'active',
            )}
            onClick={() => {
              setDrawingTool('Sticky');
              setShowSubTools('');
            }}
          >
            <StickyNoteIcon />
            {/*<img src={canvasToolbarSelectionIcon} alt="selection" />*/}
          </div>
          <div
            className={clsx(
              'canvas-toolbar-item',
              drawingTool === 'Text' && 'active',
            )}
            onClick={() => {
              setDrawingTool('Text');
              setShowSubTools('');
            }}
          >
            <TextIcon />
          </div>
          <div
            className={clsx(
              'canvas-toolbar-item',
              ['Rect', 'Circle', 'Triangle', 'RectRounded', 'Star'].includes(
                drawingTool as string,
              ) && 'active',
            )}
            onClick={() => {
              setShowSubTools('shapes');
            }}
          >
            <span>
              <ShapesIcon />
            </span>

            <div
              className="canvas-sub-toolbar"
              style={{
                display: showSubTools === 'shapes' ? 'flex' : 'none',
              }}
            >
              <div
                className="canvas-sub-toolbar-item"
                onClick={event => {
                  event.stopPropagation();
                  setDrawingTool('Rect');
                  setShowSubTools('');
                }}
              >
                <RectangleShapeIcon />
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={event => {
                  event.stopPropagation();
                  setDrawingTool('Ellipse');
                  setShowSubTools('');
                }}
              >
                <CircleShapeIcon />
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={event => {
                  event.stopPropagation();
                  setDrawingTool('Triangle');
                  setShowSubTools('');
                }}
              >
                <TriangleShapeIcon />
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={event => {
                  event.stopPropagation();
                  setDrawingTool('RectRounded');
                  setShowSubTools('');
                }}
              >
                <RoundedRectangleShapeIcon />
              </div>

              <div
                className="canvas-sub-toolbar-item"
                onClick={event => {
                  event.stopPropagation();
                  setDrawingTool('Star');
                  setShowSubTools('');
                }}
              >
                <StarShapeIcon />
              </div>

              <div
                className="canvas-sub-toolbar-item"
                onClick={event => {
                  event.stopPropagation();
                  setDrawingTool('Line');
                  setShowSubTools('');
                }}
              >
                <VerticalLineIcon />
              </div>
            </div>
          </div>
          <div
            className={clsx('canvas-toolbar-item', !drawingTool && 'active')}
            onClick={() => {
              setDrawingTool(null);
              setShowSubTools('');
            }}
          >
            <CursorIcon />
          </div>
        </div>
        <div className="canvas-footer">
          <div className="canvas-footer-actions">
            <div
              className="canvas-footer-action-item"
              onClick={() => {
                if (zoom !== 0) {
                  setZoom(Math.max(zoom - 25, 0));
                }
              }}
            >
              <ZoomOutIcon />
            </div>
            <div className="canvas-footer-action-slider">
              <Slider
                value={zoom}
                onChange={event => {
                  setZoom(event);
                }}
              />
            </div>
            <div
              className="canvas-footer-action-item"
              onClick={() => {
                if (zoom !== 100) {
                  setZoom(Math.min(zoom + 25, 100));
                }
              }}
            >
              <ZoomInIcon />
            </div>
            <div className="canvas-footer-action-text">{zoom}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
