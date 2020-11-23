import { updateRole } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;

  return (
    <ModalForm
      title="修改角色"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateRole(values.id.toString(), v)
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
          initialValue={values.name}
          rules={[{ required: true }]}
        />
        <ProFormText name="keyword" label="关键字" initialValue={values.keyword} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="desc" label="说明" initialValue={values.desc} />
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
    </ModalForm>
  );
};

export default UpdateForm;
