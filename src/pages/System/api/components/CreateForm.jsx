import React from 'react';
import { createApi } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { message } from 'antd';

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel } = props;

  return (
    <ModalForm
      title="新建接口"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(values) => {
        createApi(values)
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
        <ProFormText name="method" label="请求方式" rules={[{ required: true }]} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="category" label="分类" rules={[{ required: true }]} />
        <ProFormText name="path" label="路径" rules={[{ required: true }]} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea name="desc" label="说明" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
