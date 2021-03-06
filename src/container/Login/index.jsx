import React, {useRef, useState, useCallback, useEffect} from 'react';
import {Cell, Input, Button, Checkbox, Toast} from 'zarm';
import CustomIcon from '@/components/CustomIcon';
import Captcha from "react-captcha-code";

import {post} from '@/utils'
import cx from 'classnames';

import s from './style.module.less'

const Login = () => {
  const captchaRef = useRef();
  const [type, setType] = useState('login'); // 登录注册类型
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(''); // 验证码
  const [checkboxStat, setCheckboxStat] = useState(false); // 勾选框
  const [captcha, setCaptcha] = useState(''); // 验证码变化后存储值

  const handleCaptchaChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, []);

  const handleCheckboxChange = useCallback(() => {
    setCheckboxStat(prev => !prev);
  }, [])

  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }

    try {
      if (type === 'login') {
        const data = await post('/api/user/login', {
          username,
          password
        });
        if (data) {
          localStorage.setItem('token', data?.token || '');
          Toast.show('登录成功');
          window.location.href = '/';
        }
      } else {
        if (!checkboxStat) {
          Toast.show('请确认协议');
          return;
        }
        if (!verify) {
          Toast.show('请输入验证码')
          return
        }
        if (verify !== captcha) {
          Toast.show('验证码错误')
          return
        }
        await post('/api/user/register', {
          username,
          password
        });

        Toast.show('注册成功');
        setType('login');

      }
    } catch (e) {
      if (e.msg) {
        console.error(e.msg);
        Toast.show(e.msg);
      } else {
        console.error(e);
        Toast.show('系统错误');
      }
    }
  };

  useEffect(() => {
    document.title = type === 'login' ? '登录' : '注册';
  }, [type]);

  return (
    <div className={s.auth}>
      <div className={s.head}/>
      <div className={s.tab}>
        <span className={cx({[s.avtive]: type === 'login'})} onClick={() => setType('login')}>登录</span>
        <span className={cx({[s.avtive]: type === 'register'})} onClick={() => setType('register')}>注册</span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao"/>}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            value={username}
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima"/>}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {type === 'register' ? <Cell icon={<CustomIcon type="mima"/>}>
          <Input
            clearable
            type="text"
            placeholder="请输入验证码"
            onChange={(value) => setVerify(value)}
          />
          <Captcha ref={captchaRef} charNum={4} onChange={handleCaptchaChange}/>
        </Cell> : null}
      </div>
      <div className={s.operation}>
        {type === 'register' ? (
          <div className={s.agree}>
            <Checkbox checked={checkboxStat} onChange={handleCheckboxChange}/>
            <label className="text-light">阅读并同意<a>《downzoo-moneybook条款》</a></label>
          </div>
        ) : null}
        <Button onClick={onSubmit} block theme="primary">{type === 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
}

export default React.memo(Login);

