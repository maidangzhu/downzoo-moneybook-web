import React, {useState, useEffect, useCallback, useRef} from 'react'
import {get, REFRESH_STATE, LOAD_STATE} from '@/utils'; // Pull 组件需要的一些常量
import dayjs from 'dayjs';

import BillItem from '@/components/BillItem';
import PopupType from '@/components/PopupType';
import PopupDate from '@/components/PopupDate';
import PopupAddBill from '@/components/PopupAddBill';
import CustomIcon from '@/components/CustomIcon';
import {Icon, Pull} from 'zarm';

import s from './style.module.less';

const Home = () => {
  const typeRef = useRef(); // 账单类型ref
  const monthRef = useRef(); // 月份筛选 ref
  const addRef = useRef(); // 添加账单 ref
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [list, setList] = useState([]); // 账单列表

  useEffect(() => {
    getBillList(); // 初始化
  }, [page, currentSelect, currentTime]);

  // 获取账单方法
  const getBillList = async () => {
    const data = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`);
    const {list, totalPage} = data;

    // 下拉刷新，重制数据
    if (page === 1) {
      setList(list);
    } else {
      setList(list.concat(list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据
  const refreshData = useCallback(() => {
    setRefreshing(REFRESH_STATE.loading);
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }
  }, []);

  const loadData = useCallback(() => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }, []);

  // 添加账单弹窗
  const handleToggleType = useCallback(() => {
    typeRef.current && typeRef.current.show();
  }, []);

  // 选择月份弹窗
  const handleToggleMonth = useCallback(() => {
    monthRef.current && monthRef.current.show()
  }, []);

  // 添加账单弹窗
  const handleToggleAdd = useCallback(() => {
    addRef.current && addRef.current.show()
  }, []);

  // 筛选类型
  const handleSelectType = useCallback((item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1);
    setCurrentSelect(item);
  }, []);

  // 筛选月份
  const handleSelectMonth = useCallback((item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }, []);

  return <div className={s.home}>
    <header className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ {totalExpense}</b></span>
        <span className={s.income}>总收入：<b>¥ {totalIncome}</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={handleToggleType}>
          <span className={s.title}>{currentSelect.name || '全部类型'} <Icon className={s.arrow}
                                                                         type="arrow-bottom"/></span>
        </div>
        <div className={s.right} onClick={handleToggleMonth}>
          <span className={s.time}>{currentTime}<Icon className={s.arrow} type="arrow-bottom"/></span>
        </div>
      </div>
    </header>
    <main className={s.contentWrap}>
      {list.length > 0 && <Pull
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
      </Pull>}
    </main>
    <PopupType ref={typeRef} onSelect={handleSelectType}/>
    <PopupDate ref={monthRef} mode="month" onSelect={handleSelectMonth}/>
    <PopupAddBill ref={addRef} onReload={refreshData} />
    <div className={s.add} onClick={handleToggleAdd}><CustomIcon type='tianjia' /></div>
  </div>
}

export default Home;
