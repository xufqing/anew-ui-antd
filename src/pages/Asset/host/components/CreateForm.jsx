import React, { useState } from 'react';
import { createHost } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel, authsType, hostsType } = props;
  const [isPassword, setIsPassword] = useState(false);

  return (
    <ModalForm
      title="新建主机"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(values) => {
        createHost(values)
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
        <ProFormText name="host_name" label="主机名称" width="m" />
        <ProFormText name="ip_address" label="地址" width="m" rules={[{ required: true }]} />
        <ProFormText name="prot" label="端口" width="m" rules={[{ required: true }]} />
        <ProFormSelect
          name="host_type"
          label="主机类型"
          width="m"
          hasFeedback
          options={hostsType}
          onChange
        />
        <ProFormSelect
          name="auth_type"
          label="认证类型"
          hasFeedback
          width="m"
          options={authsType}
          fieldProps={{
            onChange: (e) => {
              if (e === 'password') {
                setIsPassword(true);
              } else {
                setIsPassword(false);
              }
            },
          }}
          rules={[{ required: true, message: '请选择认证类型' }]}
        />
        {isPassword ? (
          <ProFormText name="user" label="用户" width="m" rules={[{ required: true }]} />
        ) : null}
        <ProFormText.Password
          label="认证密码"
          name="password"
          width="m"
          rules={[{ required: isPassword }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
