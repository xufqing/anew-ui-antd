import React from 'react';
import { updateApi } from '../service';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;

  return (
    <ModalForm
      title="修改接口"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateApi(values.id.toString(), v)
          .then((res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
              actionRef.current.reload(); //刷新table
            }
          })
          .then(() => {
            onCancel();
          });
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="名称"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.name}
        />
        <ProFormText
          name="method"
          label="请求方式"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.method}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="category"
          label="分类"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.category}
        />
        <ProFormText
          name="path"
          label="路径"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.path}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="desc" label="说明" width="m" initialValue={values.desc} />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
