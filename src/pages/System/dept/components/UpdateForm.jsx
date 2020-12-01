import React, { useEffect, useState } from 'react';
import { queryDepts } from '@/pages/System/dept/service';
import { updateDept } from '../service';
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
    queryDepts({ all: true }).then((res) => {
      const depts = loopTreeItem(res.data);
      setTreeData([{ label: '暂无所属', value: 0 }].concat(depts));
    });
  }, []);

  return (
    <ModalForm
      title="修改部门"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateDept(values.id.toString(), v)
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
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          name="sort"
          label="排序"
          width="m"
          initialValue={values.sort}
          fieldProps={{ precision: 0 }}
        />
        <Form.Item label="上级部门" name="parent_id" initialValue={values.parent_id} width="m">
          <TreeSelect
            style={{ width: 330 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择部门"
          />
        </Form.Item>
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
