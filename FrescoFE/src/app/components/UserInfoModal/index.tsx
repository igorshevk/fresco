import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../selectors';
import { LogoutOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';

export const UserInfoModal = ({ logOut }) => {
  const user = useSelector(selectUser);

  const handleLogOut = () => {
    logOut();
  };

  return (
    <Fragment>
      <div
        style={{
          position: 'absolute',
          right: 0,
          width: '18rem',
          border: '1px solid #333',
          paddingBottom: '10px',
          backgroundColor: 'white',
          zIndex: 1000,
        }}
        id="account-modal"
      >
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Row
            style={{
              width: '90%',
              margin: 'auto',
              marginTop: '1rem',
              borderBottom: '1px solid #000',
            }}
          >
            <Col
              xs={8}
              xl={8}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                alt=""
                src={require('../../../assets/images/avatar-default.png')}
                style={{
                  width: '4rem',
                  borderRadius: '50%',
                  margin: 'auto',
                }}
              />
            </Col>

            <Col xs={16} xl={16}>
              <p style={{ marginBottom: 0 }}>{user?.email}</p>
              <button style={{ margin: '0.5rem 0 1rem 0' }}>Settings</button>
            </Col>
          </Row>
        </div>

        <div
          style={{
            width: '90%',
            margin: 'auto',
            marginTop: '0.5rem',
            height: '2rem',
            lineHeight: '2rem',
          }}
          onClick={() => handleLogOut()}
        >
          <LogoutOutlined
            style={{
              color: '#000',
              fontSize: '1.2rem',
            }}
          />
          <span style={{ marginLeft: '1rem', cursor: 'pointer' }}>Log Out</span>
        </div>
      </div>
    </Fragment>
  );
};
