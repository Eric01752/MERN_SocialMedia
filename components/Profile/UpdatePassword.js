import React, { useEffect, useState } from 'react';
import { Form, List, Divider, Button, Message } from 'semantic-ui-react';

function UpdatePassword({ setSuccess, setShowUpdatePassword }) {
  const [userPasswords, setUserPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [showTypedPassword, setShowTypedPassword] = useState({
    field1: false,
    field2: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { currentPassword, newPassword } = userPasswords;
  const { field1, field2 } = showTypedPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  return (
    <>
      <Form error={errorMsg !== null} loading={loading} onSubmit={handleSubmit}>
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () =>
                  setShowTypedPassword((prev) => ({
                    ...prev,
                    field1: !field1,
                  })),
              }}
              type={field1 ? 'text' : 'password'}
              iconPosition='left'
              label='Current Password'
              placeholder='Enter Current Password'
              name='currentPassword'
              onChange={handleChange}
              value={currentPassword}
            />

            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () =>
                  setShowTypedPassword((prev) => ({
                    ...prev,
                    field2: !field2,
                  })),
              }}
              type={field2 ? 'text' : 'password'}
              iconPosition='left'
              label='New Password'
              placeholder='Enter New Password'
              name='newPassword'
              onChange={handleChange}
              value={newPassword}
            />

            <Button
              disabled={loading || newPassword === '' || currentPassword === ''}
              compact
              icon='configure'
              type='submit'
              color='teal'
              content='Confirm'
            />

            <Button
              disabled={loading}
              compact
              icon='cancel'
              content='Cancel'
              onClick={() => setShowUpdatePassword(false)}
            />

            <Message error icon='meh' header='Oops!' content={errorMsg} />
          </List.Item>
        </List.List>
      </Form>

      <Divider hidden />
    </>
  );
}

export default UpdatePassword;
