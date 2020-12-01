import React, { useEffect, useState } from 'react';
import { queryDicts } from '@/pages/System/dict/service';
import { updateDict } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
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

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    queryDicts({ all: true }).then((res) => {
      const dicts = loopTreeItem(res.data);
      setTreeData([{ label: '暂无所属', value: 0 }].concat(dicts));
    });
  }, []);

  return (
    <ModalForm
      title="修改部门"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateDict(values.id.toString(), v)
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
          name="key"
          label="Key"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.key}
        />
        <ProFormText
          name="value"
          label="Value"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.value}
        />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item label="上级字典" name="parent_id" initialValue={values.parent_id} width="m">
          <TreeSelect
            style={{ width: 330 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择字典"
          />
        </Form.Item>
        <ProFormText name="desc" label="说明" initialValue={values.desc} width="m" />
      </ProForm.Group>
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
    </ModalForm>
  );
};

export default UpdateForm;
