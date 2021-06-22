import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { AttachAddon } from 'xterm-addon-attach';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';
import styles from '../index.module.css';

const SSHTerminal = (props) => {
    const { host_id, arr_num } = props
    const termRf = useRef(null);
    const [xterm, setXterm] = useState(null);

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
    }, []);

    useEffect(() => {
        const handleTerminalInit = async () => {
            if (termRf.current && xterm) {
                const token = localStorage.getItem('token');
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                let webSocket = new WebSocket(
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
                fitPlugin.fit();
                // 监听窗口
                webSocket.onopen = (e) => {
                    console.log('socket连接成功');
                    const attachPlugin = new AttachAddon(webSocket);
                    xterm.loadAddon(attachPlugin);
                    xterm.open(termRf.current);
                    xterm.focus();
                    xterm.clear();
                    
                };
                //接收服务端消息
                webSocket.onmessage = (e) => {
                    const message = e.data;
                    if (message.indexOf) {
                        if (message.indexOf('Anew-Sec-WebSocket-Key') != -1) {
                            let val = JSON.parse(localStorage.getItem('TABS_TTY_HOSTS'))
                            let secKey = message.substring(message.lastIndexOf(':') + 1, message.length).replace(/[\r\n]/g, "")
                            val[arr_num].secKey = secKey
                            localStorage.setItem('TABS_TTY_HOSTS', JSON.stringify(val));
                        }
                    }
                };


                //监听关闭事件
                webSocket.onclose = (e) => {
                    setTimeout(() => xterm.write('\r\nConnection is closed.\r\n'), 500);
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
                    fitPlugin.fit();
                    //window.onresize = () => fitPlugin.fit();
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
        <div className={styles.container}>
            <div className={styles.terminal}>
                <div ref={termRf} />
            </div>
        </div>
    );
}

export default SSHTerminal;