import React, { useEffect, useState } from 'react';
import { createGroup } from '../service';
import { queryHosts } from '@/pages/Asset/host/service';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message, Transfer, Form } from 'antd';

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel } = props;
  const [hostsData, setHostsData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const handleChange = (keys) => {
    setTargetKeys(keys);
  };

  useEffect(() => {
    queryHosts({ all: true }).then((res) => {
      if (Array.isArray(res.data.data)) {
        setHostsData(
          res.data.data.map((item) => ({
            key: item.id,
            title: item.host_name,
            description: item.ip_address,
          })),
        );
      }
    });
  }, []);

  return (
    <ModalForm
      title="新建分组"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(values) => {
        createGroup(values)
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
        <ProFormText name="name" label="名称" width="m" rules={[{ required: true }]} />
        <ProFormText name="desc" label="说明" width="m" />
        <Form.Item label="选择主机" name="hosts" width="m">
          <Transfer
            dataSource={hostsData}
            showSearch
            listStyle={{
              width: 320,
              height: 280,
            }}
            //operations={['加入', '退出']}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={(item) => `${item.title}(${item.description})`}
          />
        </Form.Item>
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
