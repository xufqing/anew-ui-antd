import { Divider, Tooltip } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';

export const listColumns = [
  {
    title: '用户名',
    dataIndex: 'username',
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
  },
  {
    title: '姓名',
    dataIndex: 'name',
    rules: [
      {
        required: true,
        message: '请输入姓名',
      },
    ],
  },
  {
    title: '手机',
    dataIndex: 'mobile',
    rules: [
      {
        pattern: /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/,
        message: '请输入正确的手机号码',
      },
    ],
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '角色',
    dataIndex: 'roles',
    render: (_, record) => {
        //const { roles = [] } = record;
        let roleList = []
        record.roles.map(({name}) => (
                roleList.push(name)
              ));
        return roleList && roleList.length > 0 ? roleList.join('、') : '无';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInForm: true,
    valueEnum: {
      true: {
        text: '激活',
        status: 'Processing',
      },
      false: {
        text: '禁用',
        status: 'Error',
      },
    },
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) => (
      <>
        <Tooltip title="修改">
          <FormOutlined
            style={{ fontSize: '17px', color: '#52c41a' }}
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="删除">
          <DeleteOutlined style={{ fontSize: '17px', color: 'red' }} />
        </Tooltip>
      </>
    ),
  },
];
