const express = require('express');
const path = require('path');
const db = require('./db');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server running on port: 8000');
});
const io = socket(server);

const messages = db.messages;
const users = db.users;

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('login', (login) => {
    console.log(socket.id + ' its - ' + login.name);
    users.push({ name: login.name, id: socket.id });
    socket.broadcast.emit('login', { name: 'Chat_Bot', content: `${login.name} has joined.` });
    console.log(users);
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    let user = users.find( user => user.id == socket.id );    
    console.log('Oh, socket ' + user.name  + ' has left');
    
    socket.broadcast.emit('removeUser', { name: 'Chat_Bot', content: `${user.name} has left the chat...` });

    users.splice(users.indexOf(user), 1);     
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});