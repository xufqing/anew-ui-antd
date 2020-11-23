import React from 'react';
import { createRole } from '../service';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel } = props;

  return (
    <ModalForm
      title="新建角色"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(values) => {
        createRole(values)
          .then((res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          })
          .then(() => {
            onCancel();
          });
      }}
    >
      <ProForm.Group>
        <ProFormText name="name" label="名称" rules={[{ required: true }]} />
        <ProFormText name="keyword" label="关键字" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="desc" label="说明" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
