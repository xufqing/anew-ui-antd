import {
  FolderOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Tabs, Button, Tooltip } from 'antd';
import DraggableTabs from '@/components/DraggableTabs';
import Terminal from './components/SSHTerminal';
import FileManager from './components/FileManager';

const { TabPane } = Tabs;
const Console = (props) => {
  const [hosts, setHosts] = useState(JSON.parse(localStorage.getItem('TABS_TTY_HOSTS')));
  const [activeKey, setActiveKey] = useState('tty0');
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [webSocketKey, setWebSocketKey] = useState(null);
  const callback = (key) => {
    setActiveKey(key)
  }

  const onEdit = (targetKey, action) => {
    if (action === "remove") {
      remove(targetKey)
    }
    //console.log(action, targetKey)
  };
  const remove = (key) => {
    let val = JSON.parse(localStorage.getItem('TABS_TTY_HOSTS'))
    val.splice(key, 1)
    localStorage.setItem('TABS_TTY_HOSTS', JSON.stringify(val));
    setHosts(val)
    if (val) {
      let [last] = [...val].reverse()
      setActiveKey(key === 'tty0' ? 'tty0' : last.actKey)
    }
  }

  //监听事件
  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.removeItem('TABS_TTY_HOSTS');
    }

    const refetch = (e) => {
      if (e.key === "TABS_TTY_HOSTS") {
        let val = JSON.parse(localStorage.getItem('TABS_TTY_HOSTS'))
        setHosts(val)
        let [last] = [...val].reverse()
        setActiveKey(last.actKey)
      }
    }
    window.addEventListener('storage', refetch)
    return () => {
      window.removeEventListener('storage', refetch)
    };
  }, [hosts]);

  return (
    <div>
      <DraggableTabs
        size="small"
        type="editable-card"
        tabBarStyle={{ margin: 0 }}
        hideAdd
        tabBarExtraContent={<Button icon={<FolderOutlined />} onClick={() => {
          const val = JSON.parse(localStorage.getItem('TABS_TTY_HOSTS'))
          if (val) {
            setWebSocketKey(val[activeKey].secKey)
            setFileModalVisible(true)
          }
        }}>文件管理器</Button>}
        onChange={callback}
        activeKey={activeKey}
        onEdit={onEdit}>
        {hosts && hosts.map((v, i) => (
          <TabPane forceRender tab={<Tooltip title={v.ipaddr + `:` + v.port}>{v.hostname}</Tooltip>} key={v.actKey}>
            <Terminal host_id={v.id} arr_num={i} />
          </TabPane>
        ))}
      </DraggableTabs>
      {fileModalVisible && (
        <FileManager
          onCancel={() => {
            setFileModalVisible(false);
          }}
          connKey={encodeURIComponent(webSocketKey)}
          modalVisible={fileModalVisible}
        />
      )}
    </div>
  );
}

export default Console;