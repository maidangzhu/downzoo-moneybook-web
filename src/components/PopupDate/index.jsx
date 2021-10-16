// PopupDate/index.jsx
import React, {forwardRef, useState, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {Popup, DatePicker} from 'zarm';

const PopupDate = forwardRef(({onSelect, mode = 'date'}, ref) => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  useImperativeHandle(ref, () => ({
    // 外部可以通过 ref.current.show 来控制组件的显示与关闭
    show: () => {
      setShow(true);
    },
    close: () => {
      setShow(false);
    }
  }));

  const choseMonth = (item) => {
    setNow(item);
    setShow(false);
    if (mode === 'month') {
      onSelect(dayjs(item).format('YYYY-MM'));
    } else if (mode === 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'));
    }
  }

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div>
      <DatePicker
        visible={show}
        value={now}
        mode={mode}
        onOk={choseMonth}
        onCancel={() => setShow(false)}
      />
    </div>
  </Popup>
});

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式
  onSelect: PropTypes.func, // 选择后的回调
}

export default PopupDate;
