import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Breadcrumb,
  Table,
  Icon,
  Divider,
  Switch,
  Button,
  Progress,
  Modal,
  message,
} from 'antd';
import styles from '../index.module.css';

const FileManager = (props) => {
  const { modalVisible, onCancel } = props;

  const columns = [
    {
      title: '名称',
      key: 'name',
      render: (info) =>
        info.kind === 'd' ? (
          <div onClick={() => {}} style={{ cursor: 'pointer' }}>
            <Icon type="folder" style={{ color: '#1890ff' }} />
            <span style={{ color: '#1890ff', paddingLeft: 5 }}>{info.name}</span>
          </div>
        ) : (
          <React.Fragment>
            <Icon type="file" />
            <span style={{ paddingLeft: 5 }}>{info.name}</span>
          </React.Fragment>
        ),
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'size',
      align: 'right',
      className: styles.fileSize,
      width: 90,
    },
    {
      title: '修改时间',
      dataIndex: 'date',
      width: 190,
    },
    {
      title: '属性',
      key: 'attr',
      render: (info) => `${info.kind}${info.code}`,
      width: 120,
    },
    {
      title: '操作',
      width: 80,
      align: 'right',
      key: 'action',
      render: (info) =>
        info.kind === '-' ? (
          <React.Fragment>
            <Icon style={{ color: '#1890ff' }} type="download" onClick={() => {}} />
            <Divider type="vertical" />
            <Icon style={{ color: 'red' }} type="delete" onClick={() => {}} />
          </React.Fragment>
        ) : null,
    },
  ];

  return (
    <Drawer
      title="文件管理器"
      placement="right"
      width={800}
      visible={modalVisible}
      onClose={onCancel}
    >
      <Table
        size="small"
        rowKey="name"
        //loading={this.state.fetching}
        pagination={false}
        columns={columns}
        scroll={{ y: scrollY }}
        bodyStyle={{
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
        }}
        //dataSource={objects}
      />
    </Drawer>
  );
};
export default FileManager;
