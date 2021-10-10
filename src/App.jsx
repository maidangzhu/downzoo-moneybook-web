import React, {useEffect, useState} from 'react';
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";

import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import {ConfigProvider} from 'zarm';
import NavBar from '@/components/NavBar';

import routes from '@/router'

const App = () => {
  const needNav = ['/', '/data', '/user'];

  const [showNav, setShowNav] = useState(false) // 是否展示 Nav
  const location = useLocation() // 拿到 location 实例
  const {pathname} = location // 获取当前路径

  useEffect(() => {
    setShowNav(needNav?.includes(pathname));
  }, [pathname]);

  return (
    <>
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
        <Switch>
          {routes.map(route => {
            return (
              <Route exact key={route.path} path={route.path}>
                <route.component/>
              </Route>
            )
          })}
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav}/>
    </>
  )
}

export default App;
