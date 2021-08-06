import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { parseCookies } from 'nookies';
import { Segment, Header, Divider, Comment, Grid } from 'semantic-ui-react';
import Chat from '../components/Chats/Chat';
import ChatListSearch from '../components/Chats/ChatListSearch';
import { useRouter } from 'next/router';
import { NoMessages } from '../components/Layout/NoData';
import Banner from '../components/Messages/Banner';
import MessageInputField from '../components/Messages/MessageInputField';
import Message from '../components/Messages/Message';
import getUserInfo from '../utils/getUserInfo';
import newMsgSound from '../utils/newMsgSound';
import cookie from 'js-cookie';

const scrollDivToBottom = (divRef) => {
  divRef.current !== null &&
    divRef.current.scrollIntoView({ behaviour: 'smooth' });
};

function Messages({ chatsData, user }) {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();

  const [connectedUsers, setConnectedUsers] = useState([]);
  const socket = useRef();

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });

  const divRef = useRef();

  //This ref is for persisting the state of the query string in url throught re-renders
  //This ref is the query string inside the url
  const openChatId = useRef('');

  //Connection onMount useEffect
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }

    if (chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect');
        socket.current.off();
      }
    };
  }, []);

  //Load Messages useEffect
  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit('loadMessages', {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.current.on('messagesLoaded', ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });

        openChatId.current = chat.messagesWith._id;
      });

      socket.current.on('noChatFound', async () => {
        const { name, profilePicUrl } = await getUserInfo(router.query.message);

        setBannerData({ name, profilePicUrl });
        setMessages([]);
        openChatId.current = router.query.message;

        divRef.current && scrollDivToBottom(divRef);
      });
    };

    if (socket.current && router.query.message) {
      loadMessages();
    }
  }, [router.query.message]);

  const sendMsg = (msg) => {
    if (socket.current) {
      socket.current.emit('sendNewMsg', {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg,
      });
    }
  };

  //Confirming msg is sent and receiving the messages useEffect
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msgSent', ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);
          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        }
      });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        let senderName;

        //When chat is open inside your browser
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);
          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.sender
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;
            senderName = previousChat.name;

            return [...prev];
          });
        } else {
          const ifPreviouslyMessaged =
            chats.filter((chat) => chat.messagesWith === newMsg.sender).length >
            0;

          if (ifPreviouslyMessaged) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;
              senderName = previousChat.name;

              return [...prev];
            });
          } else {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
            senderName = name;

            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };

            setChats((prev) => [newChat, ...prev]);
          }
        }

        newMsgSound(senderName);
      });
    }
  }, []);

  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef);
  }, [messages]);

  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit('deleteMsg', {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId,
      });

      socket.current.on('msgDeleted', () => {
        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      });
    }
  };

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
        headers: { Authorization: cookie.get('token') },
      });

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );

      router.push('/messages', undefined, { shallow: true });
    } catch (error) {
      alert('Error deleting chat');
    }
  };

  return (
    <>
      <Segment padded basic size='large' style={{ marginTop: '5px' }}>
        <Header
          icon='home'
          content='Go Back!'
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        />

        <Divider hidden />

        <div style={{ marginBottom: '10px' }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>

        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size='big'>
                  <Segment
                    raised
                    style={{ overflow: 'auto', maxHeight: '32rem' }}
                  >
                    {chats.map((chat, index) => (
                      <Chat
                        connectedUsers={connectedUsers}
                        key={index}
                        chat={chat}
                        deleteChat={deleteChat}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>

              <Grid.Column width={12}>
                {router.query.message && (
                  <>
                    <div
                      style={{
                        overflow: 'auto',
                        overflowX: 'hidden',
                        maxHeight: '35rem',
                        height: '35rem',
                        backgroundColor: 'whitesmoke',
                      }}
                    >
                      <>
                        <div style={{ position: 'sticky', top: '0' }}>
                          <Banner bannerData={bannerData} />
                        </div>
                        {messages.length > 0 && (
                          <>
                            {messages.map((message, index) => (
                              <Message
                                key={index}
                                divRef={divRef}
                                bannerProfilePic={bannerData.profilePicUrl}
                                message={message}
                                user={user}
                                deleteMsg={deleteMsg}
                              />
                            ))}
                          </>
                        )}
                      </>
                    </div>

                    <MessageInputField sendMsg={sendMsg} />
                  </>
                )}
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <NoMessages />
        )}
      </Segment>
    </>
  );
}

Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });

    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Messages;
