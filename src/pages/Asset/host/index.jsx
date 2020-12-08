import {
  DeleteOutlined,
  PlusOutlined,
  FormOutlined,
  CodeTwoTone,
} from '@ant-design/icons';
import { Button, Tooltip, Divider, Modal, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryHosts, deleteHost } from './service';
import { queryDicts } from '@/pages/System/dict/service';
import { history } from 'umi';

const HostList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [hostsType, setHostsType] = useState([]);
  const [authsType, setAuthsType] = useState([]);
  const actionRef = useRef();

  const handleDelete = (record) => {
    if (!record) return;
    if (Array.isArray(record.ids) && !record.ids.length) return;
    const content = `您是否要删除这${Array.isArray(record.ids) ? record.ids.length : ''}项？`;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        deleteHost(record).then((res) => {
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
  useEffect(() => {
    queryDicts({ type_key: 'host_type' }).then((res) => {
      if (Array.isArray(res.data)) {
        setHostsType(
          res.data.map((item) => ({
            label: item.value,
            value: item.key,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    queryDicts({ type_key: 'auth_type' }).then((res) => {
      if (Array.isArray(res.data)) {
        setAuthsType(
          res.data.map((item) => ({
            label: item.value,
            value: item.key,
          })),
        );
      }
    });
  }, []);

  const columns = [
    {
      title: '主机名',
      dataIndex: 'host_name',
    },
    {
      title: '地址',
      dataIndex: 'ip_address',
    },
    {
      title: '端口',
      dataIndex: 'port',
    },
    {
      title: '主机类型',
      dataIndex: 'host_type',
      valueType: 'select',
      fieldProps: {
        options: hostsType,
      },
    },
    {
      title: '认证类型',
      dataIndex: 'auth_type',
      valueType: 'select',
      fieldProps: {
        options: authsType,
      },
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
          <Tooltip title="控制台">
            <CodeTwoTone
              style={{ fontSize: '17px', color: 'blue' }}
              onClick={() => {
                // history.push('/asset/console?host_id=' + record.id.toString())
                window.open('/ssh/console?host_id=' + record.id.toString())
              }}
            />
          </Tooltip>
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
        request={(params) => queryHosts({ ...params }).then((res) => res.data)}
        columns={columns}
        rowSelection={{}}
      />
      {createModalVisible && (
        <CreateForm
          authsType={authsType}
          hostsType={hostsType}
          actionRef={actionRef}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
        />
      )}
      {updateModalVisible && (
        <UpdateForm
          authsType={authsType}
          hostsType={hostsType}
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

export default HostList;
