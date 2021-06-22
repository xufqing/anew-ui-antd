import { GithubOutlined } from '@ant-design/icons';
import { Checkbox,Button } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import LoginForm from './components/Login';
import styles from './style.less';
const { Tab, UserName, Password, Submit } = LoginForm;

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="普通登录">
          <UserName
            name="username"
            placeholder="用户名: admin or guest"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码: 123456"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Tab key="ldap" tab="LDAP登录">
          <UserName
            name="userName"
            placeholder="用户名: admin or guest"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码: 123456"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          本项目地址：
          <Button icon={<GithubOutlined />} onClick={()=>{const w=window.open('about:blank');w.location.href = 'https://github.com/xufqing/anew-server'}}/>
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
