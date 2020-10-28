import { GridContent } from '@ant-design/pro-layout';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Card, Col, Button, Upload, Row, Tabs, message } from 'antd';
import BaseForm from './components/BaseForm';
import ChangePasswordFrom from './components/ChangePasswordFrom';
import IconFont from '@/components/IconFont';
import { connect } from 'umi';
import styles from './settings.less';

const Settings = (props) => {
  const { userInfo = {}, dispatch } = props;
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/getUserInfo',
      });
    }
  }, []);
  const getRole = (list = []) => {
    let roleList = [];
    list.map(({ name }) => roleList.push(name));
    return roleList && roleList.length > 0 ? roleList.join('、') : '无';
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('只可以上传JPG/PNG/GIF图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      console.log(info)
      message.success('上传成功');
      let currentUser = JSON.parse(localStorage.getItem('user')) || {};
      currentUser.avatar = info.file.response.data.url;
      localStorage.setItem('user', JSON.stringify(currentUser));
      if (dispatch) {
        dispatch({
          type: 'user/getUserInfo',
        });
      }
    }
  };

  const tokenHeaders = {
    Authorization: "Bearer " + localStorage.getItem('token'),
  }
  return (
    <GridContent>
      {userInfo.username && (
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              title="关于我"
              bordered={false}
              style={{
                marginBottom: 14,
              }}
            >
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={userInfo.avatar} />
                  <Upload
                    name="avatar"
                    headers={tokenHeaders}
                    accept=".jpg,.jpeg,.png,.gif"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/v1/user/info/uploadImg"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    <div className={styles.button_view}>
                      <Button>
                        <UploadOutlined /> 更换头像
                      </Button>
                    </div>
                  </Upload>
                </div>
                <div className={styles.detail}>
                  <div>
                    <p style={{ marginRight: '15px' }}>
                      <IconFont
                        type="iconxingmingyonghumingnicheng"
                        style={{ fontSize: '16px', marginRight: 8 }}
                      />
                      用户名
                    </p>
                    {userInfo.username}
                  </div>
                  <div>
                    <p style={{ marginRight: '29px' }}>
                      <IconFont
                        type="iconxingmingyonghumingnicheng"
                        style={{ fontSize: '16px', marginRight: 8 }}
                      />
                      姓名
                    </p>
                    {userInfo.name}
                  </div>
                  <div>
                    <p style={{ marginRight: '29px' }}>
                      <IconFont type="iconyouxiang" style={{ fontSize: '16px', marginRight: 8 }} />
                      邮箱
                    </p>
                    {userInfo.email}
                  </div>
                  <div>
                    <p style={{ marginRight: '29px' }}>
                      <IconFont type="icon19" style={{ fontSize: '16px', marginRight: 8 }} />
                      手机
                    </p>
                    {userInfo.mobile}
                  </div>
                  <div>
                    <p style={{ marginRight: '29px' }}>
                      <IconFont type="iconrole-list" style={{ fontSize: '16px', marginRight: 8 }} />
                      角色
                    </p>
                    {getRole(userInfo.roles)}
                  </div>
                  <div>
                    <p style={{ marginRight: '29px' }}>
                      <IconFont type="iconbumen" style={{ fontSize: '16px', marginRight: 8 }} />
                      部门
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={7} md={24}>
            <Card title="个人设置" bordered={false} style={{ width: '730px', height: '480px' }}>
              <Tabs tabPosition="right" onChange={() => {}}>
                <Tabs.TabPane tab="基本信息" key="baseInfo">
                  <BaseForm values={userInfo} dispatch={dispatch} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="修改密码" key="changePwd">
                  <ChangePasswordFrom />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      )}
    </GridContent>
  );
};

export default connect(({ user }) => ({
  userInfo: user.userInfo,
}))(Settings);