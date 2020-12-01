import React, { useEffect, useState } from 'react';
import { queryDicts } from '@/pages/System/dict/service';
import { createDict } from '../service';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message, TreeSelect, Form } from 'antd';

// 处理返回的树数据
const loopTreeItem = (tree) =>
  Array.isArray(tree)
    ? tree.map(({ id, value, children, ...item }) => ({
        ...item,
        title: value,
        value: id,
        children: children && loopTreeItem(children),
      }))
    : null;

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel } = props;
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    queryDicts({ all: true }).then((res) => {
      const dicts = loopTreeItem(res.data);
      setTreeData([{ label: '暂无所属', value: 0 }].concat(dicts));
    });
  }, []);

  return (
    <ModalForm
      title="新建字典"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(values) => {
        createDict(values)
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
        <ProFormText name="key" label="Key" width="m" rules={[{ required: true }]} />
        <ProFormText name="value" label="Value" width="m" rules={[{ required: true }]} />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item label="上级字典" name="parent_id" width="m">
          <TreeSelect
            style={{ width: 330 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择字典"
          />
        </Form.Item>
        <ProFormText name="desc" label="说明" width="m"/>
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
