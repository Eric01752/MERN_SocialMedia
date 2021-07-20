const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require('dotenv').config({ path: './config.env' });
const connectDb = require('./utilsServer/connectDb');
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDb();
const { addUser, removeUser } = require('./utilsServer/roomActions');
const { loadMessages, sendMsg } = require('./utilsServer/messageActions');

io.on('connection', (socket) => {
  socket.on('join', async ({ userId }) => {
    const users = await addUser(userId, socket.id);

    setInterval(() => {
      socket.emit('connectedUsers', {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    if (!error) {
      socket.emit('messagesLoaded', { chat });
    } else {
      socket.emit('noChatFound');
    }
  });

  socket.on('sendNewMsg', async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);

    if (!error) {
      socket.emit('msgSent', { newMsg });
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

nextApp.prepare().then(() => {
  app.use('/api/signup', require('./api/signup'));
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/posts', require('./api/posts'));
  app.use('/api/profile', require('./api/profile'));
  app.use('/api/notifications', require('./api/notifications'));
  app.use('/api/chats', require('./api/chats'));

  app.all('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Express server running on ${PORT}`);
  });
});
