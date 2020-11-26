import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal, message, Tag } from 'antd';
import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryOperlogs, deleteOperlog } from './service';

const OperlogList = () => {
  const actionRef = useRef();

  const handleDelete = (record) => {
    if (!record) return;
    if (Array.isArray(record.ids) && !record.ids.length) return;
    const content = `您是否要删除这${Array.isArray(record.ids) ? record.ids.length : ''}项？`;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        deleteOperlog(record).then((res) => {
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
      title: '接口名称',
      dataIndex: 'name',
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      render: (_, row) => {
        let color = 'blue';
        if (row.method == 'POST') {
          color = 'gold';
        } else if (row.method == 'PATCH') {
          color = 'lime';
        } else if (row.method == 'PUT') {
          color = 'green';
        } else if (row.method == 'DELETE') {
          color = 'red';
        }
        return <Tag color={color}>{row.method}</Tag>;
      },
    },
    {
      title: '访问路径',
      dataIndex: 'path',
    },  
    {
      title: '响应码',
      dataIndex: 'status',
      search: false,
      render: (_, row) => {
        let statusColor = 'red'
        if (row.status === 200 ) {
          statusColor = 'green'
        } else if (row.status === 500){
          statusColor = 'orange'
        }
        return (
          <Tag color={statusColor}>{row.status}</Tag>
        )
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      search: false,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '所在地',
      dataIndex: 'ip_location',
      search: false,
    },
    {
      title: '耗时',
      dataIndex: 'latency',
      search: false,
      render: (_, row) => {
        const ms = (row.latency / 1000000).toFixed(2)
        let msColor = 'green'
        if (ms > 1000 && ms < 5000 ) {
          msColor = 'orange'
        } else if (ms > 5000){
          msColor = 'red'
        }
        return (
          <Tag color={msColor}>{ms}</Tag>
        )
      }
    },
    {
      title: '创建日期',
      dataIndex: 'created_at',
      search: false,
    },
    {
      title: 'UA',
      dataIndex: 'user_agent',
      search: false,
      render: (_, row) => {
        function info() {
          Modal.info({
            title: 'UA',
            content: (
              <div>
                <p>{row.user_agent}</p>
              </div>
            ),
            onOk() {},
          });
        }
        return (
        <Button tooltip="预览" onClick={info} shape="circle" icon={<SearchOutlined />} />
        );
      },
    },
    {
      title: '详情',
      //dataIndex: 'body',
      search: false,
      render: (_, row) => {
        function info() {
          Modal.info({
            title: '详情',
            content: (
              <div>
                <h3>Request Data</h3>
                <p>{row.body}</p>
                <h3>Response Data</h3>
                <p>{row.data}</p>
              </div>
              
            ),
            onOk() {},
          });
        }
        return (
        <Button tooltip="预览" onClick={info} shape="circle" icon={<SearchOutlined />} />
        );
      },
    },
    // {
    //   title: '响应体',
    //   dataIndex: 'data',
    //   render: (_, row) => {
    //     function info() {
    //       Modal.info({
    //         title: 'data',
    //         content: (
    //           <div>
    //             <p>{row.data}</p>
    //           </div>
    //         ),
    //         onOk() {},
    //       });
    //     }
    //     return (
    //     <Button tooltip="预览" onClick={info} shape="circle" icon={<SearchOutlined />} />
    //     );
    //   },
    // },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
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
        request={(params) => queryOperlogs({ ...params }).then((res) => res.data)}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};

export default OperlogList;
