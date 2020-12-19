/**
 *
 * Dashboard
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Input, Menu, Select, Tabs, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';

import { selectDashboard } from './selectors';
import { selectToken, selectUser } from '../../selectors';
import { dashboardSaga } from './saga';
import { actions as globalActions } from '../../slice';
import dashboardIcon from 'assets/icons/dashboard.svg';
import pageIcon from 'assets/icons/page.svg';
import { BarChartOutlined } from '@ant-design/icons';

// Components
import { UserModal } from '../../components/UserModal';
import Axios from 'axios';
import { InviteMemberModal } from '../../components/InviteMemberModal';

import './styles.less';
import { BoardList } from '../BoardList';

import { Categories } from '../Categories';

import { CanvasApiService } from 'services/APIService';
import {
  CanvasCategoryInterface,
  CanvasResponseInterface,
} from '../../../services/APIService/interfaces';
import { CanvasBoardTemplates } from '../../components/CanvasBoardTemplates';
import { CanvasCategoryService } from '../../../services/APIService/CanvasCategory.service';
import { BoardApiService } from 'services/APIService/BoardsApi.service';
import { Collaboration } from '../../components/Collaboration';
import moment from 'moment';
const { TabPane } = Tabs;
export const PERMISSION = {
  // ADMIN: 'admin',
  EDITOR: 'editor',
  VIEW: 'view',
};

interface Props {
  match?: any;
}

export const Dashboard = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardSaga });
  const [organization, setOrganization] = useState<any>(null);
  const [isShowUserModal, setIsShowUserModal] = useState(false);
  const [isShowInvitationModal, setIsShowInvitationModal] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState(PERMISSION.EDITOR);
  const [isModalOpen, setModalOpen] = useState(false);
  const [canvasName, setCanvasName] = useState('');
  const [categories, setCategories] = useState<CanvasCategoryInterface[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [canvasList, setCanvasList] = useState<CanvasResponseInterface[]>([]);
  const [showAddNewBoard, setAddNewBoard] = useState(false);
  const [isShowAddNewCanvas, setIsShowAddNewCanvas] = useState(false);
  const [loadingCreateCanvas, setLoadingCreateCanvas] = useState(false);
  const [loadingCategoriesList, setLoadingCategoriesList] = useState(false);
  const [loadingCanvasList, setLoadingCanvasList] = useState(false);

  const orgId = props?.match?.params?.id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dashboard = useSelector(selectDashboard);
  // console.log('dashboard', dashboard);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  // const user = useSelector(selectUser);
  useEffect(() => {
    console.log(dashboard);
    if (!!dashboard.linkInvitation) {
      setEmail('');
      setIsShowInvitationModal(false);
    }
  }, [dashboard]);
  useEffect(() => {
    Axios.request({
      method: 'GET',
      url: process.env.REACT_APP_BASE_URL + 'organization/' + orgId,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setOrganization(response.data);
        console.log('response.data', response.data);
      })
      .catch(error => {
        console.error(error.response);
      });
  }, [orgId, token]);

  const handleSearch = (value: string) => {
    dispatch(
      actions.searchEmailRequest({ data: { email: value, orgId }, token }),
    );
  };

  const createCanvas = React.useCallback(() => {
    setLoadingCreateCanvas(true);
    const data = {
      name: canvasName,
      orgId: orgId,
      data: '',
      categoryId: categoryId,
    };

    CanvasApiService.create(data).subscribe(
      data => {
        console.log(data);
        setLoadingCreateCanvas(false);
        history.push(`/canvas/${data.id}?organization=${orgId}`, { orgId });
      },
      error => {
        setLoadingCreateCanvas(false);
        console.error(error.response);
      },
    );
  }, [canvasName, history, orgId, categoryId]);

  const _handleSelectEmail = value => {
    setEmail(value);
  };

  const _handleChangePermission = value => {
    setPermission(value);
  };

  const _handleInvitation = () => {
    const itemEmail = dashboard.listEmail?.filter(item => item.email === email);
    if (itemEmail.length) {
      dispatch(
        actions.invitationRequest({
          data: itemEmail,
          permission,
          token,
          history,
          orgId,
        }),
      );
    } else {
      dispatch(
        actions.invitationRequest({
          data: { email },
          permission,
          token,
          history,
          orgId,
        }),
      );
    }
  };

  const handleDeleteCanvas = (id: string) => {
    CanvasApiService.deleteById(id, orgId).subscribe(
      data => {
        console.log(data);
        setCanvasList(canvasList.filter(item => item.id !== id));
      },
      error => {
        console.error(error);
      },
    );
  };

  useEffect(() => {
    const profileIcon = document.getElementById(
      'profile-icon',
    ) as HTMLDivElement;
    if (profileIcon) {
      profileIcon.addEventListener('click', () => {
        setIsShowUserModal(true);
      });

      document.addEventListener('click', event => {
        const accountModal = document.getElementById('account-modal');
        if (accountModal) {
          if (
            !(
              accountModal.contains(event.target as Node) ||
              profileIcon.contains(event.target as Node)
            )
          ) {
            setIsShowUserModal(false);
          }
        }
      });
    }
  }, []);

  const getCanvasList = React.useCallback(() => {
    setLoadingCanvasList(true);
    CanvasApiService.getByOrganizationId(orgId).subscribe(
      data => {
        setCanvasList(data);
        setLoadingCanvasList(false);
      },
      () => {
        setLoadingCanvasList(false);
      },
    );
  }, [orgId]);

  const getCategoriesList = () => {
    setLoadingCategoriesList(true);
    CanvasCategoryService.list().subscribe(
      data => {
        setCategories(data);
        setLoadingCategoriesList(false);
      },
      () => {
        setLoadingCategoriesList(false);
      },
    );
  };

  useEffect(() => {
    getCanvasList();
  }, [getCanvasList, orgId]);

  useEffect(() => {
    getCategoriesList();
  }, [orgId, showAddNewBoard]);

  const handleLogOut = () => {
    dispatch(globalActions.removeAuth());
    localStorage.clear();
    history.push('/auth/login');
  };

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Description of Dashboard" />
      </Helmet>

      {isShowUserModal && (
        <UserModal
          organization={organization}
          logOut={() => handleLogOut()}
          showInvite={() => setIsShowInvitationModal(true)}
        />
      )}

      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        className="dashboard"
        // onChange={() => {
        //   // getBoardsList();
        //   // getCanvasList();
        //   // getCategoriesList();
        // }}
      >
        <TabPane tab={<img src={pageIcon} alt="page" />} key="1">
          {showAddNewBoard ? (
            <CanvasBoardTemplates
              orgId={orgId}
              onClose={() => setAddNewBoard(false)}
            />
          ) : (
            <div className="card-section">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddNewBoard(true)}
              >
                New Board
              </Button>
              <h3 className="dashboard__tab-title">My Boards</h3>

              {organization && <BoardList orgId={organization.orgId} />}
            </div>
          )}
        </TabPane>
        <TabPane tab={<img src={dashboardIcon} alt="dashboard" />} key="2">
          <div className="card-section">
            <Button
              hidden={isShowAddNewCanvas}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsShowAddNewCanvas(true);
                setCanvasName('');
              }}
            >
              Create Canvas
            </Button>

            <div
              hidden={!isShowAddNewCanvas}
              style={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '20px',
              }}
            >
              <Input
                placeholder="Name"
                name="name"
                onChange={event => setCanvasName(event.currentTarget.value)}
                style={{ width: 300, flexShrink: 0 }}
              />
              <Select
                defaultValue=""
                style={{ width: 220, flexShrink: 0 }}
                onChange={value => {
                  setCategoryId(value);
                }}
                loading={loadingCategoriesList}
                allowClear
              >
                <Select.Option value="" disabled>
                  Category
                </Select.Option>
                {categories.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createCanvas}
                disabled={!categoryId || !canvasName}
                loading={loadingCreateCanvas}
              >
                Create Canvas
              </Button>
            </div>

            <h3 className="card-section-title">Custom Canvas</h3>
            <div className="card-grid">
              {!loadingCanvasList && !canvasList.length && (
                <h3
                  style={{
                    width: '100%',
                    color: 'red',
                    textAlign: 'center',
                  }}
                >
                  No Canvases
                </h3>
              )}
              {canvasList.map((data, index) => (
                <div className="cards-board" key={index}>
                  <Link
                    to={{
                      pathname: `/canvas/${data.id}?organization=${orgId}`,
                      state: { orgId },
                    }}
                  >
                    <img
                      alt="example"
                      style={{
                        border: '1px solid #f0f2f5',
                        backgroundColor: 'white',
                      }}
                      src={
                        data.path ||
                        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                      }
                    />
                  </Link>

                  <div className="card-footer">
                    <div className="card-action">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="0">
                              <Link
                                to={{
                                  pathname: `/canvas/${data.id}?organization=${orgId}`,
                                  state: { orgId },
                                }}
                              >
                                Edit
                              </Link>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <a href="#">Action</a>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              key="3"
                              onClick={() => handleDeleteCanvas(data.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <div className="action-button">
                          <span className="material-icons">more_vert</span>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="card-title">
                      {data.name}
                      {data && data.name && data.name.length >= 34 ? (
                        <span className="tooltip">{data.name}</span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="card-timestamp">
                      {data && data.createdAt
                        ? moment(data.createdAt).format('LLL')
                        : ''}
                    </div>
                    <div className="card-users">
                      <span className="material-icons">group</span>
                      <Collaboration users={data.users} />
                    </div>
                  </div>
                </div>
              ))}
              {loadingCanvasList &&
                Array(5)
                  .fill(1)
                  .map((item, index) => (
                    <div className="cards-board" key={item + index}>
                      <Skeleton.Image />

                      <div className="card-footer">
                        <Skeleton
                          active
                          paragraph={{ rows: 0, style: { display: 'none' } }}
                          title={{ width: '100%', style: { marginTop: 0 } }}
                          className="card-title"
                        />
                        <Skeleton
                          active
                          paragraph={{ rows: 0, style: { display: 'none' } }}
                          title={{ width: '100%', style: { marginTop: 0 } }}
                          className="card-timestamp"
                        />

                        <Skeleton
                          active
                          paragraph={{ rows: 0, style: { display: 'none' } }}
                          title={{ width: '100%', style: { marginTop: 0 } }}
                          className="card-users"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </TabPane>
        {user && user.role === 'ADMIN' && (
          <TabPane tab={<BarChartOutlined />} key="3">
            <div className="card-section">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                New Category
              </Button>
              <h3 className="dashboard__tab-title">Categories</h3>
              <Categories
                visible={isModalOpen}
                onCancel={() => {
                  setModalOpen(false);
                }}
              />
            </div>
          </TabPane>
        )}
      </Tabs>

      {isShowInvitationModal && (
        <InviteMemberModal
          onCancel={() => setIsShowInvitationModal(false)}
          handleInvitation={_handleInvitation}
          listEmail={dashboard.listEmail}
          email={email}
          loading={dashboard.loading}
          handleSearch={handleSearch}
          handleSelectEmail={_handleSelectEmail}
          handleChangePermission={_handleChangePermission}
        />
      )}
    </>
  );
});
