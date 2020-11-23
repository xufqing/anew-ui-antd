import React, { useEffect, useState } from 'react';
import { queryRoles } from '@/pages/System/role/service';
import { updateUser } from '../service';
import { queryDepts } from '@/pages/System/dept/service';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
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
      const depts = loopTreeItem(res.data)
      setTreeData([{ label: '暂无所属', value: 0 }].concat(depts));
    });
  }, []);

  return (
    <ModalForm
      title="修改用户"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateUser(values.id.toString(), v).then((res) => {
          if (res.code === 200 && res.status === true) {
            message.success(res.message);
            actionRef.current.reload(); //刷新table
          }
        }).then(()=>{
          onCancel();
        })
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="姓名"
          initialValue={values.name}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
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
        <ProFormText
          name="mobile"
          label="手机"
          initialValue={values.mobile}
          rules={[
            {
              pattern: /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/,
              message: '请输入正确的手机号码',
            },
          ]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          initialValue={values.email}
          rules={[
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="role_id"
          label="角色"
          hasFeedback
          initialValue={values.role_id}
          request={() =>
            queryRoles().then((res) =>
              res.data.data.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            )
          }
          rules={[{ required: true, message: '请选择角色' }]}
        />
        <Form.Item label="部门" name="dept_id" initialValue={values.dept_id}>
          <TreeSelect
            style={{ width: 330 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择部门"
          />
        </Form.Item>
        <ProFormText.Password label="重置密码" name="password" placeholder="输入则修改密码" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
