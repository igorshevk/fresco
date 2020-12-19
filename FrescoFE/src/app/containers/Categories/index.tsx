import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

import './styles.less';
import { CategoriesApiService } from 'services/APIService/CategoriesApi.service';
import Modal from 'antd/lib/modal/Modal';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface Props {
  visible: boolean;
  onCancel: Function;
}

export const Categories = (props: Props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [editingKey, setEditingKey] = useState('');
  const [deletingKey, setDeletingKey] = useState('');

  React.useEffect(() => {
    CategoriesApiService.getAllCategories().subscribe(response => {
      setData(response);
    });
  }, []);

  const isEditing = record => record.id === editingKey;

  const edit = record => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        CategoriesApiService.updateById(item.id, { name: row.name }).subscribe(
          () => {
            setData(newData);
          },
        );
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const addCategory = data => {
    CategoriesApiService.create(data).subscribe(res => {
      setData(prevState => [...prevState, res]);
      props.onCancel();
    });
  };

  const deleteCategory = () => {
    CategoriesApiService.deleteById(deletingKey).subscribe(d => {
      setData(prevState => prevState.filter(c => c.id !== deletingKey));
    });
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '75%',
      editable: true,
    },

    {
      title: 'Edit',
      dataIndex: 'Edit',
      render: (_: any, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a onClick={() => edit(record)}>Edit</a>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'Delete',
      render: (_: any, record) => {
        return (
          <span>
            <Popconfirm title="Sure to Delete?" onConfirm={deleteCategory}>
              <a
                onClick={() => {
                  setDeletingKey(record.id);
                }}
              >
                Delete
              </a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
      <Modal
        visible={props.visible}
        onCancel={() => {
          props.onCancel(false);
        }}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              addCategory(values);
              form.resetFields();
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name="name"
            label="Category name"
            rules={[
              {
                required: true,
                message: 'Please input the category name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
