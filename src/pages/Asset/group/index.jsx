import {
  DeleteOutlined,
  PlusOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Divider, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryGroups, deleteGroup } from './service';

const GroupList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef();

  const handleDelete = (record) => {
    if (!record) return;
    if (Array.isArray(record.ids) && !record.ids.length) return;
    const content = `您是否要删除这${Array.isArray(record.ids) ? record.ids.length : ''}项？`;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        deleteGroup(record).then((res) => {
          if (res.code === 200 && res.status === true) {
            message.success(res.message);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '说明',
      dataIndex: 'desc',
      search: false,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Divider type="vertical" />
          <Tooltip title="修改">
            <FormOutlined
              style={{ fontSize: '17px', color: '#52c41a' }}
              onClick={() => {
                setFormValues(record);
                handleUpdateModalVisible(true);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除">
            <DeleteOutlined
              style={{ fontSize: '17px', color: 'red' }}
              onClick={() => handleDelete({ ids: [record.id] })}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button key="1" type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Button
              key="2"
              type="primary"
              onClick={() => handleDelete({ ids: selectedRows.map((item) => item.id) })}
              danger
            >
              <DeleteOutlined /> 删除
            </Button>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
          </div>
        )}
        request={(params) => queryGroups({ ...params }).then((res) => res.data)}
        columns={columns}
        rowSelection={{}}
        search={{
          filterType: 'light',
        }}
      />
      {createModalVisible && (
        <CreateForm
          actionRef={actionRef}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
        />
      )}
      {updateModalVisible && (
        <UpdateForm
          actionRef={actionRef}
          onCancel={() => {
            handleUpdateModalVisible(false);
          }}
          modalVisible={updateModalVisible}
          values={formValues}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default GroupList;
