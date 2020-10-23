import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryUsers} from './service';
import {listColumns} from './columns'

const UserList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();

  return (
    <PageHeaderWrapper>
    <ProTable
      actionRef={actionRef}
      rowKey="id"
      toolBarRender={(action, { selectedRows }) => [
        <Button key="1" type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>,
        selectedRows && selectedRows.length > 0 && (<Button  key="2" type="primary" onClick={() => handleModalVisible(true)} danger>
         <DeleteOutlined /> 删除
      </Button>)
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
      request={(params, filter) => queryUsers({ ...params, filter }).then(res => res.data)}
      columns={listColumns}
      rowSelection={{}}
    />
    <CreateForm actionRef={actionRef} onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />
    {stepFormValues && Object.keys(stepFormValues).length ? (
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setStepFormValues({});

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        updateModalVisible={updateModalVisible}
        values={stepFormValues}
      />
    ) : null}
  </PageHeaderWrapper>
  );
};

export default UserList;
