import React from 'react';
import { queryRoles } from '@/pages/System/role/service';
import { createUser } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel } = props;
  return (
    <ModalForm
      title="新建用户"
      visible={modalVisible}
      onVisibleChange={() => onCancel()}
      onFinish={(values) => {
        createUser(values)
          .then((res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          });

        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="name"
          label="姓名"
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="mobile"
          label="手机"
          rules={[
            {
              pattern: /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/,
              message: '请输入正确的手机号码',
            },
          ]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          rules={[
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="roles"
          label="角色"
          hasFeedback
          request={() =>
            queryRoles().then((res) =>
              res.data.data.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            )
          }
          mode="multiple"
          rules={[{ required: true, type: 'array', message: '请选择角色' }]}
        />
        <ProFormText.Password label="密码" name="password" rules={[{ required: true }]} />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
