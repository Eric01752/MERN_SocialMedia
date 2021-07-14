import React from 'react';
import { Divider, Comment, Icon, List } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import calculateTime from '../../utils/calculateTime';

function Chat({ chat, setChats }) {
  const router = useRouter();

  return (
    <>
      <List selection>
        <List.Item
          active={router.query.message === chat.messagesWith}
          onClick={() =>
            router.push(`/messages?message=${chat.messagesWith}`, undefined, {
              shallow: true,
            })
          }
        >
          <Comment>
            <Comment.Avatar src={chat.profilePicUrl} />
            <Comment.Content>
              <Comment.Author as='a'>{chat.name}</Comment.Author>

              <Comment.Metadata>
                <div>{calculateTime(chat.date)}</div>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon name='trash alternate' color='red' />
                </div>
              </Comment.Metadata>

              <Comment.Text>
                {chat.lastMessage.length > 20
                  ? `${chat.lastMessage.substring(0, 20)} ...`
                  : chat.lastMessage}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </List.Item>
      </List>
      <Divider />
    </>
  );
}

export default Chat;
