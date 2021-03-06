import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { postComment } from '../../utils/postActions';

function CommentInputField({ postId, user, setComments, socket }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (socket.current) {
      socket.current.emit('commentPost', { postId, userId: user._id, text });

      socket.current.on('postCommented', ({ commentId }) => {
        const newComment = {
          _id: commentId,
          user,
          text,
          date: Date.now(),
        };

        setComments((prev) => [newComment, ...prev]);
        setText('');
      });
    } else {
      postComment(postId, user, text, setComments, setText);
    }

    setLoading(false);
  };

  return (
    <Form reply onSubmit={handleSubmit}>
      <Form.Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Add Comment'
        action={{
          color: 'blue',
          icon: 'edit',
          loading: loading,
          disabled: text === '' || loading,
        }}
      />
    </Form>
  );
}

export default CommentInputField;
