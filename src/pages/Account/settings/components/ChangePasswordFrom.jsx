import React from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { changePassword } from '../service';
import { message } from 'antd';

const BaseForm = (props) => {
  const { actionRef } = props;
  const [form] = ProForm.useForm();

  // 校验密码
  const validateToNextPassword = (rule, value, callback) => {
    // 校验密码强度
    // 1. 必须同时包含大写字母、小写字母和数字，三种组合
    // 2. 长度在8-30之间
    const passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
    if (value) {
      if (!passwordReg.test(value)) {
        return Promise.reject('密码必须同时包含大写字母、小写字母和数字');
      }
      if (value.length < 8 || value.length > 30) {
        return Promise.reject('密码长度8-30位');
      }
    }
    return Promise.resolve();
  };
  // 确认密码
  const handleCheckRePwd = (rule, value, callback) => {
    let password = form.getFieldValue('newPassword');
    if (password) {
      if (password !== value) {
        return Promise.reject('两次输入的密码不一致');
      } else {
        return Promise.resolve();
      }
    }
  };
  return (
    <ProForm
      form={form}
      onFinish={async (v) => {
        await changePassword({ oldPassword: v.oldPassword, newPassword: v.newPassword }).then(
          (res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
            }
          },
        );
      }}
    >
      <ProForm.Group>
        <ProFormText.Password label="旧密码" name="oldPassword" rules={[{ required: true }]} />
        <ProFormText.Password
          label="新密码"
          name="newPassword"
          rules={[{ required: true, validator: validateToNextPassword }]}
        />
        <ProFormText.Password
          label="确认密码"
          name="newPassword2"
          rules={[{ required: true, validator: handleCheckRePwd }]}
        />
      </ProForm.Group>
    </ProForm>
  );
};

export default BaseForm;