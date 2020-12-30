// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './Auth/login',
        },
      ],
    },
    // 无布局路由
    {
      path: '/ssh',
      //component: '../layouts/UserLayout',
      routes: [
        {
          path: '/ssh/console',
          name: 'console',
          component: './SSH/console',
          //authority: ['admin'],
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/workplace',
            },
            {
              path: '/workplace',
              name: 'workplace',
              component: './Workplace',
            },
            {
              path: '/account',
              name: 'account',
              routes: [
                {
                  path: '/account/settings',
                  name: 'settings',
                  component: './Account/settings',
                  //authority: ['admin'],
                },
              ]
            },
            {
              path: '/asset',
              name: 'asset',
              //component: './Dashboard',
              //authority: ['admin'],
              routes: [
                {
                  path: '/asset/host',
                  name: 'host',
                  component: './Asset/host',
                  //authority: ['admin'],
                },
                {
                  path: '/asset/connection',
                  name: 'connection',
                  component: './Asset/connection',
                  //authority: ['admin'],
                },
                {
                  path: '/asset/record',
                  name: 'record',
                  component: './Asset/record',
                  //authority: ['admin'],
                },
              ],
            },
            {
              path: '/system',
              name: 'system',
              //component: './Dashboard',
              //authority: ['admin'],
              routes: [
                {
                  path: '/system/user',
                  name: 'user',
                  component: './System/user',
                  //authority: ['admin'],
                },
                {
                  path: '/system/dept',
                  name: 'dept',
                  component: './System/dept',
                  //authority: ['admin'],
                },
                {
                  path: '/system/role',
                  name: 'role',
                  component: './System/role',
                  //authority: ['admin'],
                },
                {
                  path: '/system/menu',
                  name: 'menu',
                  component: './System/menu',
                  //authority: ['admin'],
                },
                {
                  path: '/system/api',
                  name: 'api',
                  component: './System/api',
                  //authority: ['admin'],
                },
                {
                  path: '/system/dict',
                  name: 'dict',
                  component: './System/dict',
                  //authority: ['admin'],
                },
                {
                  path: '/system/operlog',
                  name: 'operlog',
                  component: './System/operlog',
                  authority: ['admin'],
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
