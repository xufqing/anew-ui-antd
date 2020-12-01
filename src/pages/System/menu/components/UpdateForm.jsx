import React, { useEffect, useState } from 'react';
import { queryMenus } from '@/pages/System/menu/service';
import { updateMenu } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
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

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    queryMenus({ all: true }).then((res) => {
      const depts = loopTreeItem(res.data);
      setTreeData([{ label: '顶级菜单', value: 0 }].concat(depts));
    });
  }, []);

  return (
    <ModalForm
      title="修改菜单"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateMenu(values.id.toString(), v)
          .then((res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
              actionRef.current.reload(); //刷新table
            }
          })
          .then(() => {
            onCancel();
          });
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
        <ProFormText name="icon" label="图标" width="m" initialValue={values.icon} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="path" label="路径" width="m" initialValue={values.path} />
        <ProFormDigit
          name="sort"
          label="排序"
          width="m"
          initialValue={values.sort}
          fieldProps={{ precision: 0 }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="status"
          label="状态"
          width="m"
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
        <Form.Item label="上级菜单" name="parent_id" width="m" initialValue={values.parent_id}>
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

export default UpdateForm;
