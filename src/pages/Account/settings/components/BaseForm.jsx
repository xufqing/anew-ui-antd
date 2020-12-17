import React from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { updateUserInfo } from '../service';
import { message } from 'antd';

const BaseForm = (props) => {
  const { values, getInfo } = props;

  return (
    <ProForm
      onFinish={async (v) => {
        await updateUserInfo(values.id.toString(), v).then((res) => {
          if (res.code === 200 && res.status === true) {
            message.success(res.message);
            let currentUser = JSON.parse(localStorage.getItem('user')) || {};
            currentUser.name = v.name;
            localStorage.setItem('user', JSON.stringify(currentUser));
            getInfo();
          }
        });
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="姓名"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.name}
        />
        <ProFormText
          name="mobile"
          label="手机"
          width="m"
          rules={[
            {
              pattern: /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/,
              message: '请输入正确的手机号码',
            },
          ]}
          initialValue={values.mobile}
        />
        <ProFormText
          name="email"
          label="邮箱"
          width="m"
          rules={[
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
            },
          ]}
          initialValue={values.email}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default BaseForm;
