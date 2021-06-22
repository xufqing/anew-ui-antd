import {
  DeleteOutlined,
  PlusOutlined,
  FileDoneOutlined,
  CodeTwoTone,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import { Button, Tooltip, Divider, Modal, message, Menu } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import DescPage from './components/Descriptions';
import { queryHosts, deleteHost } from './service';
import { queryDicts } from '@/pages/System/dict/service';
import { queryGroups } from '@/pages/Asset/group/service';

const HostList = (props) => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [descModalVisible, handleDescModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [hostsType, setHostsType] = useState([]);
  const [authsType, setAuthsType] = useState([]);
  const [hostsGroup, setHostsGroup] = useState([]);
  const [group_id, setGroup_id] = useState();
  const actionRef = useRef();
  const {
    dispatch,
    consoleWin,
  } = props;

  const handleConsoleWin = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeConsoleWin',
        payload,
      });
    }
  };

  const setConsoleHosts = (val) => {
    let hosts = JSON.parse(localStorage.getItem('TABS_TTY_HOSTS'))
    if (hosts) {
      hosts.push(val)
    } else {
      hosts = []
      hosts.push(val)
    }
    localStorage.setItem('TABS_TTY_HOSTS', JSON.stringify(hosts));
  }
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
      onCancel() { },
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

  useEffect(() => {
    queryGroups({ all: true, not_null: true }).then((res) => {
      if (Array.isArray(res.data.data)) {
        setHostsGroup([{ id: 0, name: '所有主机' }, ...res.data.data]);
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
                let actKey = "tty0"
                let hosts = JSON.parse(localStorage.getItem('TABS_TTY_HOSTS'))
                if (hosts) {
                  actKey = "tty" + hosts.length.toString()
                } 
                const hostsObj = { hostname: record.host_name, ipaddr: record.ip_address, port: record.port, id: record.id.toString(), actKey: actKey, secKey: null }
                setConsoleHosts(hostsObj)
                if (consoleWin) {
                  if (!consoleWin.closed) {
                    consoleWin.focus();
                  } else {
                    handleConsoleWin(window.open('/asset/ssh/console', 'consoleTrm'));
                  }
                } else {
                  handleConsoleWin(window.open('/asset/ssh/console', 'consoleTrm'));
                }
              }}
            />
          </Tooltip>

          <Divider type="vertical" />
          <Tooltip title="详情">
            <FileDoneOutlined
              style={{ fontSize: '17px', color: '#52c41a' }}
              onClick={() => {
                setFormValues(record);
                handleDescModalVisible(true);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <TableDropdown
            key="actionGroup"
            onSelect={(key) => {
              if (key === 'delete') {
                handleDelete({ ids: [record.id] });
              } else if (key === 'edit') {
                setFormValues(record);
                handleUpdateModalVisible(true);
              }
            }}
            menus={[
              { key: 'edit', name: '修改' },
              { key: 'delete', name: '删除' },
            ]}
          />
          {/* <Tooltip title="删除">
            <DeleteOutlined
              style={{ fontSize: '17px', color: 'red' }}
              onClick={() => handleDelete({ ids: [record.id] })}
            />
          </Tooltip> */}
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
        params={{
          group_id,
        }}
        columns={columns}
        rowSelection={{}}
        tableRender={(_, dom) => (
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <Menu
              onSelect={(e) => {
                if (e.key === '0') {
                  setGroup_id();
                } else {
                  setGroup_id(e.key);
                }
              }}
              style={{ width: 156 }}
              defaultSelectedKeys={['0']}
              defaultOpenKeys={['sub1']}
              mode="inline"
            >
              <Menu.SubMenu
                key="sub1"
                title={
                  <span>
                    <UsergroupAddOutlined />
                    <span>主机分组</span>
                  </span>
                }
              >
                {hostsGroup &&
                  hostsGroup.map((item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>)}
              </Menu.SubMenu>
            </Menu>
            <div
              style={{
                flex: 1,
              }}
            >
              {dom}
            </div>
          </div>
        )}
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
      {descModalVisible && (
        <DescPage
          actionRef={actionRef}
          onCancel={() => {
            handleDescModalVisible(false);
          }}
          modalVisible={descModalVisible}
        />
      )}
    </PageHeaderWrapper>
  );
};


// 把窗口全局变量传递过来
export default connect(({ global }) => ({
  consoleWin: global.consoleWin,
  consoleHosts: global.consoleHosts,
}))(HostList);