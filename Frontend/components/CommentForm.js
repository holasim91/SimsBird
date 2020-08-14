import React, { useCallback, useEffect } from 'react';
import Proptypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitForm} style={{ position: 'relative', margin: 0 }}>
      <Input.TextArea
        value={commentText}
        onChange={onChangeCommentText}
        rows={4}
      />
      <Button
        style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
        type="primary"
        htmlType="submit"
        loading={addCommentLoading}
      >
        등록
      </Button>
    </Form>
  );
};

CommentForm.propTypes = {
  post: Proptypes.object.isRequired,
};

export default CommentForm;
