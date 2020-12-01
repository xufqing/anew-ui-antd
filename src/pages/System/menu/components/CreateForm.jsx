import React, { useEffect, useState } from 'react';
import { queryMenus } from '@/pages/System/menu/service';
import { createMenu } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-form';
import { message, TreeSelect, Form } from 'antd';

// 处理返回的树数据
const loopTreeItem = (tree) =>
  Array.isArray(tree)
    ? tree.map(({ id, name, children, ...item }) => ({
        ...item,
        title: name,
        value: id,
        children: children && loopTreeItem(children),
      }))
    : null;

const CreateForm = (props) => {
  const { actionRef, modalVisible, onCancel } = props;
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    queryMenus({ all: true }).then((res) => {
      const depts = loopTreeItem(res.data)
      setTreeData([{ label: '顶级菜单', value: 0 }].concat(depts));
    });
  }, []);

  return (
    <ModalForm
      title="新建菜单"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(values) => {
        createMenu(values).then((res) => {
          if (res.code === 200 && res.status === true) {
            message.success(res.message);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }).then(()=>{
          onCancel();
        })
      }}
    >
      <ProForm.Group>
        <ProFormText name="name" label="名称" width="m" rules={[{ required: true }]} />
        <ProFormText name="icon" label="图标" width="m" />
        <ProFormText name="path" label="路径" width="m" />
        <ProFormDigit name="sort" label="排序" width="m" fieldProps={{ precision: 0 }}/>
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item label="上级菜单" name="parent_id" width="m">
          <TreeSelect
            style={{ width: 330 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择菜单"
          />
        </Form.Item>
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateForm;
