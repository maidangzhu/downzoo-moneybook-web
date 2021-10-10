import React, {useState, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';

import {TabBar} from 'zarm';
import CustomIcon from '@/components/CustomIcon';

import style from './style.module.less';

const NavBar = ({showNav}) => {
  const [activeKey, setActiveKey] = useState(useLocation().pathname);
  const history = useHistory();

  const changeTab = useCallback((path) => {
    setActiveKey(path);
    history.push(path);
  }, []);

  return (
    <TabBar visible={showNav} className={style.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type='zhangdan'/>}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type='tongji'/>}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type='wode'/>}
      />
    </TabBar>
  )
}

NavBar.propTypes = {
  showNav: PropTypes.bool
}

export default NavBar;
