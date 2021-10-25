import React, {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import { Popup, Icon } from 'zarm';
import cx from 'classnames';
import { get } from '@/utils';

import s from './style.module.less';

// forwardRef 用于拿到父组件传入的ref属性，这样在父组件便能同构ref控制子组件
const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); // 组件的显示和隐藏
  const [active, setActive] = useState('all'); // 激活的 type
  const [expense, setExpense] = useState([]); // 支出类型标签
  const [income, setIncome] = useState([]); // 收入类型标签

  useEffect(() => {
    (async () => {
      // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余。
      const data = await get('/api/type/list');
      const { list } = data;

      setExpense(list.filter((i) => Number(i.type) === 1));
      setIncome(list.filter((i) => Number(i.type) === 2));
    })();
  }, []);

  useImperativeHandle(ref, () => ({
    // 外部可以通过 ref.current.show 来控制组件的显示与关闭
    show: () => {
      setShow(true);
    },
    close: () => {
      setShow(false);
    },
  }));

  const choseType = useCallback((item) => {
    setActive(item);
    setShow(false);
    onSelect(item);
  }, []);

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMackClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          />
        </div>
        <div className={s.content}>
          <div
            onClick={() => choseType({ id: 'all' })}
            className={cx({ [s.all]: true, [s.active]: active === 'all' })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active === item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active === item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func,
};

export default React.memo(PopupType);
