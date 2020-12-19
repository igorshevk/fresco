import { Button, Dropdown, Input, Menu, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CanvasApiService } from 'services/APIService';
import { CanvasResponseInterface } from 'services/APIService/interfaces';

interface CanvasesListProps {
  orgId: string;
}

const CanvasesList = (props: CanvasesListProps) => {
  const [canvasList, setCanvasList] = React.useState<CanvasResponseInterface[]>(
    [],
  );
  const [canvasName, setCanvasName] = React.useState('');
  const [isShowAddNewCanvas, setIsShowAddNewCanvas] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    CanvasApiService.getByOrganizationId(props.orgId).subscribe(data => {
      setCanvasList(data);
    });
  }, [props.orgId]);

  const handleDeleteCanvas = (id: string) => {
    CanvasApiService.deleteById(id, props.orgId).subscribe(
      data => {
        console.log(data);
        setCanvasList(canvasList.filter(item => item.id === id));
      },
      error => {
        console.error(error);
      },
    );
  };
  const createCanvas = React.useCallback(() => {
    const data = {
      name: canvasName,
      orgId: props.orgId,
      data: '',
      categoryId: '',
      imageId: '',
    };
    CanvasApiService.create(data).subscribe(
      data => {
        console.log(data);
        history.push(`/canvas/${data.orgId}/${data.id}`);
      },
      error => {
        console.error(error.response);
      },
    );
  }, [canvasName, history, props.orgId]);

  return (
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
          allowClear
        >
          <Select.Option value="" disabled>
            Category
          </Select.Option>
          <Select.Option value="Customer Journey Maps">
            Customer Journey Maps
          </Select.Option>
          <Select.Option value=" Innovation">Innovation</Select.Option>
          <Select.Option value=" Business model">Business model</Select.Option>
          <Select.Option value="Product">Product</Select.Option>
          <Select.Option value="Marketing">Marketing</Select.Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={createCanvas}>
          Create Canvas
        </Button>
      </div>

      <h3 className="card-section-title">Custom Canvas</h3>

      <div className="card-grid">
        {canvasList.map((data, index) => (
          <div className="cards-board" key={index}>
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />

            <div className="card-footer">
              <div className="card-action">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <Link to={`/canvas/${data.orgId}/${data.id}`}>
                          Edit
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="1">
                        <a href="http://www.taobao.com/">Action</a>
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
              <div className="card-title">{data.name}</div>
              <div className="card-timestamp">Opened Oct 12, 2020</div>
              <div className="card-users">
                <span className="material-icons">group</span>
                <span className="user-title">
                  Anup Surendan, JJ and 5+ collaborating
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CanvasesList;
