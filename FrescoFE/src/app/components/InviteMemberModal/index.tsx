import React, { Fragment } from 'react';
import { Modal, Input, Button, Row, Col, Select, AutoComplete } from 'antd';
import { PERMISSION } from 'app/containers/Dashboard';
let timer;

const { Option } = Select;

export const InviteMemberModal = ({
  onCancel,
  handleInvitation,
  listEmail,
  email,
  handleSearch,
  handleSelectEmail,
  handleChangePermission,
  loading,
}) => {
  const handleOnCancel = () => {
    onCancel();
  };

  const copyLink = () => {
    console.log('copyLink');
  };

  const _handleSearch = (value: string) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      handleSearch(value);
    }, 1000);
  };

  return (
    <Fragment>
      <Modal visible={true} footer={null} onCancel={() => handleOnCancel()}>
        <div style={{ width: '90%', margin: 'auto' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Invite to team
          </p>
          <p>Email addresses</p>

          <div>
            <Row>
              <Col xs={16} xl={16}>
                <AutoComplete
                  style={{ width: '100%', borderRadius: 5, marginBottom: 10 }}
                  onSearch={_handleSearch}
                  placeholder="Search email"
                  onSelect={value => handleSelectEmail(value)}
                  onChange={value => handleSelectEmail(value)}
                >
                  {listEmail?.map(item => (
                    <Option key={item.id} value={item.email}>
                      {email.email}
                    </Option>
                  ))}
                </AutoComplete>
              </Col>

              <Col xs={8} xl={8}>
                <Select
                  style={{
                    width: '90%',
                    margin: 'auto',
                    float: 'right',
                  }}
                  defaultValue={PERMISSION.EDITOR}
                  onChange={value => handleChangePermission(value)}
                >
                  {/* <Option value={PERMISSION.ADMIN}>{PERMISSION.ADMIN}</Option> */}
                  <Option value={PERMISSION.EDITOR}>{PERMISSION.EDITOR}</Option>
                  <Option value={PERMISSION.VIEW}>{PERMISSION.VIEW}</Option>
                </Select>
              </Col>
            </Row>
          </div>

          <Button type="primary" loading={loading} onClick={handleInvitation}>
            Send invitations
          </Button>

          <div style={{ margin: '1rem 0' }}>
            <Row>
              <Col xs={20} xl={20}>
                <Input disabled={true} />
              </Col>

              <Col xs={4} xl={4}>
                <Button type="primary" onClick={() => copyLink()}>
                  Copy
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
