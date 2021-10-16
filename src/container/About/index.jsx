import React from 'react'
import Header from '@/components/Header'

import s from './style.module.less'

const About = () => {
  return <>
    <Header title='关于我们'/>
    <div className={s.about}>
      <h2>关于项目</h2>
      <article>跟着掘金上的小册学习如何使用Node + React开发在线记账本项目</article>
    </div>
  </>
};

export default About;
