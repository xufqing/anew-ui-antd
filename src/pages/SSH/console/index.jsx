import {
  FullscreenOutlined,
} from '@ant-design/icons';
import React, { useRef, useEffect, useState } from 'react';
import { Button } from 'antd';
import { queryHostByID } from '@/pages/Asset/host/service';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { AttachAddon } from 'xterm-addon-attach';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';
import styles from './index.module.css';
import FileManager from './components/FileManager';

const Console = (props = {}) => {
  const host_id = props.location.query.host_id;
  const termRf = useRef(null);
  const [xterm, setXterm] = useState(null);
  const [webSocketKey, setWebSocketKey] = useState(null);
  const [host, setHost] = useState({});
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const fullScreen = () => {
    if (!document.webkitIsFullScreen) {
      requestFullScreen();
    } else {
      exitFullscreen();
    }
  };
  const requestFullScreen = () => {
    const dom = document.getElementById('consoleContent');//绑定想要全屏的组件
    if (dom.requestFullscreen) {
      dom.requestFullscreen();
    } else if (dom.mozRequestFullScreen) {
      dom.mozRequestFullScreen();
    } else if (dom.webkitRequestFullScreen) {
      dom.webkitRequestFullScreen();
    }
  };
  const exitFullscreen = () => {
    const dom = document;
    if (dom.exitFullscreen) {
      dom.exitFullscreen();
    } else if (dom.mozCancelFullScreen) {
      dom.mozCancelFullScreen();
    } else if (dom.webkitCancelFullScreen) {
      dom.webkitCancelFullScreen();
    }
  };

  const terminalOpts = {
    //allowTransparency: true,
    fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
    fontSize: 15,
    // theme: {
    //   background: '#202124',
    //   foreground: '#ffffff73',
    // },
    cursorStyle: 'underline',
    cursorBlink: true,
  };
  useEffect(() => {
    const terminal = new Terminal(terminalOpts);
    setXterm(terminal);
    queryHostByID(host_id).then((res) => {
      setHost(res.data);
    });
  }, []);

  useEffect(() => {
    const handleTerminalInit = async () => {
      if (termRf.current && xterm) {
        const token = localStorage.getItem('token');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let webSocket = new WebSocket(
          // `${protocol}//localhost:9000/api/v1/host/ssh?host_id=` + host_id + '&token=' + token,
          `${protocol}//${window.location.host}/api/v1/host/ssh?host_id=` +
          host_id +
          '&token=' +
          token,
        );
        const fitPlugin = new FitAddon();
        const webLinksPlugin = new WebLinksAddon();
        const SearchPlugin = new SearchAddon();
        xterm.loadAddon(fitPlugin);
        xterm.loadAddon(webLinksPlugin);
        xterm.loadAddon(SearchPlugin);
        // 监听窗口
        webSocket.onopen = (e) => {
          console.log('socket连接成功');
          const attachPlugin = new AttachAddon(webSocket);
          xterm.loadAddon(attachPlugin);
          xterm.open(termRf.current);
          xterm.focus();
          xterm.clear();
          fitPlugin.fit();
        };
        //接收服务端消息
        webSocket.onmessage = (e) => {
          const message = e.data;
          if (message.indexOf) {
            if (message.indexOf('Anew-Sec-WebSocket-Key') != -1) {
              setWebSocketKey(message.substring(message.lastIndexOf(':') + 1, message.length).replace(/[\r\n]/g,""));
            }
          }
        };


        //监听关闭事件
        webSocket.onclose = (e) => {
          console.log(e)
          if (e.code === 3333) {
            window.location.href = 'about:blank';
            window.close();
          } else {
            setTimeout(() => xterm.write('\r\nConnection is closed.\r\n'), 500);
          }
        };
        //监听窗口大小
        xterm.onResize((size) => {
          const resize = JSON.stringify({
            type: 'resizePty',
            cols: size.cols,
            rows: size.rows,
          });
          webSocket.send(resize);
          xterm.resize(size.cols, size.rows);
          //fitPlugin.fit();
          window.onresize = () => fitPlugin.fit();
        });
      }
    };
    handleTerminalInit();
  }, [termRf, xterm]);
  // //监听窗口事件
  // useEffect(() => {
  //   const listener = (ev) => {
  //     console.log(ev)
  //     ev.preventDefault();
  //     ev.returnValue = '确定离开关闭控制台吗？';
  //   };
  //   window.addEventListener('beforeunload', listener);
  //   return () => {
  //     window.removeEventListener('beforeunload', listener);
  //   };
  // }, []);



  return (
    <div className={styles.container} id="consoleContent">
      <div className={styles.header}>
        <div>
          {host.host_name} | {host.user}@{host.ip_address}:{host.port}
        </div>
        <div style={{ textAlign: 'right', paddingRight: 6 }}>
          <Button
            style={{ marginRight: 10 }}
            onClick={() => {
              setFileModalVisible(true);
            }}
          >
            文件管理器
          </Button>
          <Button
            icon={<FullscreenOutlined />}
            onClick={() => {
              fullScreen();
            }}
          />
        </div>
      </div>
      <div className={styles.terminal}>
        <div ref={termRf} />
      </div>
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
};

export default Console;
