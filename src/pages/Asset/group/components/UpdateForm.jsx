import React, { useEffect, useState } from 'react';
import { updateGroup } from '../service';
import { queryHosts } from '@/pages/Asset/host/service';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message, Transfer, Form } from 'antd';

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;
  const [hostsData, setHostsData] = useState([]);
  const [targetKeys, setTargetKeys] = useState(values.hosts_id);
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
      title="修改分组"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateGroup(values.id.toString(), v)
          .then((res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
              actionRef.current.reload(); //刷新table
            }
          })
          .then(() => {
            onCancel(); //关闭弹窗
          });
        //return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="名称"
          width="m"
          initialValue={values.name}
          rules={[{ required: true }]}
        />
        <ProFormText name="desc" label="说明" width="m" initialValue={values.desc} />
        <Form.Item label="选择主机" name="hosts" width="m">
          <Transfer
            dataSource={hostsData}
            showSearch
            listStyle={{
              width: 320,
              height: 280,
            }}
            //operations={['加入', '退出']}
            targetKeys={targetKeys ? targetKeys : []}
            onChange={handleChange}
            render={(item) => `${item.title}(${item.description})`}
          />
        </Form.Item>
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
