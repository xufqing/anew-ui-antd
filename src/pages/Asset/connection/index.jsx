import { DeleteOutlined} from '@ant-design/icons';
import { Tooltip, Divider, Modal, message } from 'antd';
import React, {useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryConnections, deleteConnection } from './service';

const ConnectionList = () => {
  const actionRef = useRef();

  const handleDelete = (record) => {
    if (!record) return;
    const content = `您是否要注销该连接？`;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        deleteConnection(record).then((res) => {
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
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '主机名',
      dataIndex: 'host_name',
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
      title: '接入时间',
      dataIndex: 'connect_time',
    },
    {
      title: '最后活动时间',
      dataIndex: 'last_active_time',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '标识',
      dataIndex: 'key',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Divider type="vertical" />
          <Tooltip title="注销">
            <DeleteOutlined
              style={{ fontSize: '17px', color: 'red' }}
              onClick={() => handleDelete({ key: record.key })}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        pagination={false}
        search={false}
        actionRef={actionRef}
        rowKey="connect_time"
        request={(params) => queryConnections({ ...params })}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default ConnectionList;
