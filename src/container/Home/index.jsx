import React, {useState, useEffect} from 'react'
import {get, REFRESH_STATE, LOAD_STATE} from '@/utils' // Pull 组件需要的一些常量
import dayjs from 'dayjs';

import BillItem from '@/components/BillItem';
import {Icon, Pull} from 'zarm'

import s from './style.module.less'

const Home = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [list, setList] = useState([]); // 账单列表

  useEffect(() => {
    getBillList(); // 初始化
  }, [page])

  // 获取账单方法
  const getBillList = async () => {
    const data = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}`);
    const { list, totalPage } = data;

    // 下拉刷新，重制数据
    if (page === 1) {
      setList(list);
    } else {
      setList(list.concat(list));
    }
    setTotalPage(totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ 200</b></span>
        <span className={s.income}>总收入：<b>¥ 500</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left}>
          <span className={s.title}>类型 <Icon className={s.arrow} type="arrow-bottom"/></span>
        </div>
        <div className={s.right}>
          <span className={s.time}>2022-06<Icon className={s.arrow} type="arrow-bottom"/></span>
        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
      {list.length > 0 ? <Pull
        animationDuration={200}
        stayTime={400}
        refresh={{
          state: refreshing,
          handler: refreshData
        }}
        load={{
          state: loading,
          distance: 200,
          handler: loadData
        }}
      >
        {list.map((item, index) => <BillItem
          list={item}
          key={index}
        />)}
      </Pull> : null
      }
    </div>
  </div>
}

export default Home;
