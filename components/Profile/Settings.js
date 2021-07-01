import React, { useState, useEffect, useRef } from 'react';
import { Divider, Message, List, Checkbox } from 'semantic-ui-react';
import UpdatePassword from './UpdatePassword';

function Settings({ newMessagePopup }) {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showMessageSettings, setShowMessageSettings] = useState(false);
  const [popupSetting, setPopupSetting] = useState(newMessagePopup);

  const isFirstRun = useRef(true);

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
  }, [popupSetting]);

  return (
    <>
      {success && (
        <>
          <Message icon='check circle' header='Updated Successfully' success />
          <Divider hidden />
        </>
      )}

      <List size='huge' animated>
        <List.Item>
          <List.Icon name='user secret' size='large' verticalAlign='middle' />
          <List.Content>
            <List.Header
              as='a'
              onClick={() => setShowUpdatePassword(!showUpdatePassword)}
              content='Update Password'
            />
          </List.Content>
          {showUpdatePassword && (
            <UpdatePassword
              setSuccess={setSuccess}
              setShowUpdatePassword={setShowUpdatePassword}
            />
          )}
        </List.Item>

        <Divider />

        <List.Item>
          <List.Icon
            name='paper plane outline'
            size='large'
            verticalAlign='middle'
          />
          <List.Content>
            <List.Header
              onClick={() => setShowMessageSettings(!showMessageSettings)}
              as='a'
              content='Show New Message Popup?'
            />
          </List.Content>

          {showMessageSettings && (
            <div style={{ marginTop: '10px' }}>
              Control whether a Popup should appear when there is a new message?
              <br />
              <Checkbox checked={popupSetting} toggle onChange={() => {}} />
            </div>
          )}
        </List.Item>
      </List>
    </>
  );
}

export default Settings;
