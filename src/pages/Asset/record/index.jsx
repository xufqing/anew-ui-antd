import { DeleteOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Tooltip, Divider, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRecords, deleteRecord } from './service';
import PlayerModal from './components/PlayerModal';

const RecordList = () => {
  const actionRef = useRef();
  const [modalVisible, handleModalVisible] = useState(false);
  const [values, setValues] = useState({});

  const handleDelete = (record) => {
    if (!record) return;
    if (Array.isArray(record.ids) && !record.ids.length) return;
    const content = `您是否要删除这${Array.isArray(record.ids) ? record.ids.length : ''}项？`;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        deleteRecord(record).then((res) => {
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
      title: '用户名',
      dataIndex: 'user_name',
    },
    {
      title: '主机名',
      dataIndex: 'host_name',
    },
    {
      title: '用户',
      dataIndex: 'user',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
    },
    {
      title: '端口',
      dataIndex: 'port',
    },
    {
      title: '标识',
      dataIndex: 'key',
    },
    {
      title: '接入时间',
      dataIndex: 'connect_time',
      search: false,
    },
    {
      title: '注销时间',
      dataIndex: 'logout_time',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Tooltip title="播放录像">
            <VideoCameraOutlined
              style={{ fontSize: '17px', color: '#52c41a' }}
              onClick={() => {
                setValues(record);
                handleModalVisible(true);
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
        request={(params) => queryRecords({ ...params }).then((res) => res.data)}
        columns={columns}
        rowSelection={{}}
      />
      {modalVisible && (
        <PlayerModal
          onCancel={() => {
            handleModalVisible(false);
          }}
          modalVisible={modalVisible}
          values={values}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default RecordList;
