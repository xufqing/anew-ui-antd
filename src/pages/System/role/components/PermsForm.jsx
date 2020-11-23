import React, { useEffect, useState } from 'react';
import { updatePermsRole } from '../service';
import { queryMenus } from '@/pages/System/menu/service';
import { queryApis } from '@/pages/System/api/service';
import { getRolePermsByID } from '../service';
import { DrawerForm } from '@ant-design/pro-form';
import { message, Tree, Checkbox, Col, Row, Divider } from 'antd';

// 处理返回的树数据
const loopTreeItem = (tree) =>
  Array.isArray(tree)
    ? tree.map(({ id, name, children, ...item }) => ({
        ...item,
        title: name,
        key: id,
        children: children && loopTreeItem(children),
      }))
    : null;

const PermsForm = (props) => {
  const { actionRef, modalVisible, onCancel, values } = props;
  const [treeData, setTreeData] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  const onCheck = (keys, info) => {
    let allKeys = keys.checked;
    const parentKey = info.node.parent_id;
    if (allKeys.indexOf(parentKey)) {
      setCheckedKeys(allKeys);
    } else {
      allKeys = allKeys.push(parentKey);
      setCheckedKeys(allKeys);
    }
  };

  const onChange = (checkedValues) => {
    setCheckedList(checkedValues);
  };

  useEffect(() => {
    queryMenus({ all: true }).then((res) => {
      setTreeData(loopTreeItem(res.data));
    });
    queryApis({ tree: true, all: true }).then((res) => {
      setApiData(res.data);
    });
    getRolePermsByID(values.id).then((res) => {
      setCheckedKeys(res.data.menus_id);
      setCheckedList(res.data.apis_id);
    });
  }, []);

  return (
    <DrawerForm
      //title="设置权限"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={() => {
        updatePermsRole(values.id.toString(), {
          menus_id: checkedKeys,
          apis_id: checkedList,
        })
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
        //return true;
      }}
    >
      <h3>菜单权限</h3>
      <Divider />

      <Tree
        checkable
        checkStrictly
        style={{ width: 330 }}
        //defaultCheckedKeys={selectedKeys}
        //defaultSelectedKeys={selectedKeys}
        autoExpandParent={true}
        selectable={false}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />

      <Divider />
      <h3>API权限</h3>
      <Divider />
      <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
        {apiData.map((item, index) => {
          return (
            <div key={index}>
              <h4>{item.category}</h4>
              <Row>
                {item.children.map((item, index) => {
                  return (
                    <Col span={4} key={index}>
                      <Checkbox value={item.id}>{item.name}</Checkbox>
                    </Col>
                  );
                })}
              </Row>
              <Divider />
            </div>
          );
        })}
      </Checkbox.Group>
    </DrawerForm>
  );
};

export default PermsForm;
