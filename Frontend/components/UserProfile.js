import React, { useCallback } from 'react';
import Link from 'next/link';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`}>
            <a>
              Twit
              <br />
              {me.Posts.length}
            </a>
          </Link>
        </div>,
        <div key="following">
          <Link href="/profile">
            <a>
              Followings
              <br />
              {me.Followings.length}
            </a>
          </Link>
        </div>,
        <div key="followers">
          <Link href="/profile">
            <a>
              Followers
              <br />
              {me.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={(
          <Link href={`/user/${me.id}`}>
            <a>
              <Avatar>{me.nickname[0]}</Avatar>
            </a>
          </Link>
        )}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>
        LogOut
      </Button>
    </Card>
  );
};

export default UserProfile;
