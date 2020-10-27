import React from 'react';
import { queryRoles } from '@/pages/System/role/service';
import { updateUser } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;
  return (
    <ModalForm
      title="修改用户"
      visible={modalVisible}
      onVisibleChange={() => onCancel()}
      onFinish={(v) => {
        updateUser(values.id.toString(), v).then((res) => {
          if (res.code === 200 && res.status === true) {
            message.success(res.message);
            actionRef.current.reload(); //刷新table
          } 
        });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="姓名"
          initialValue={values.name}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          hasFeedback
          initialValue={values.status}
          options={[
            {
              value: true,
              label: '激活',
            },
            {
              value: false,
              label: '禁用',
            },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="mobile"
          label="手机"
          initialValue={values.mobile}
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
          initialValue={values.email}
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
          initialValue={values.roles.map((item) => item.id)}
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
        <ProFormText.Password label="重置密码" name="password" placeholder="输入则修改密码" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
