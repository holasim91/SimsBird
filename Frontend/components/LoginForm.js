import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  useEffect(() => {
    if (logInError) {
      // eslint-disable-next-line no-alert
      alert(logInError);
    }
  }, [logInError]);

  const onSumbitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]); // 컴포넌트에 넣는 것은 useCallback으로 감싼다
  return (
    <FormWrapper onFinish={onSumbitForm}>
      <div>
        <label htmlFor="user-id">E-Mail</label>
        <br />
        <Input
          name="user-id"
          value={email}
          onChange={onChangeEmail}
          type="email"
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">Password</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
