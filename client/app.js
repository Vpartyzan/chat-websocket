const socket = io();

socket.on('login', ({ name, content }) => addMessage(name, content));
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('removeUser', ({ name, content}) => addMessage(name, content));

const loginForm = document.querySelector('#welcome-form'),
  messagesSection = document.querySelector('#messages-section'),
  messagesList = document.querySelector('#messages-list'),
  addMessageForm = document.querySelector('#add-messages-form'),
  userNameInput = document.querySelector('#username'),
  messageContentInput = document.querySelector('#message-content');

let userName = '';

const login = function(event) {
  event.preventDefault();

  if (userNameInput.value !== '') {
    userName = userNameInput.value;
    messageContent = `${userName} has joined to chat.`;

    socket.emit('login', { name: userName, content: messageContent, event: 'login' });

    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else {
    alert('The login field must not be empty');
  }
  
};

const addMessage = function(author, content) {
  const message = document.createElement('li');
  const title = document.createElement('h3');
  const messageContent = document.createElement('div');

  message.setAttribute('class', 'message message--received');
  title.setAttribute('class', 'message__author');
  messageContent.setAttribute('class', 'message__content');
  
  messageContent.innerHTML = content;

  message.appendChild(title);
  message.appendChild(messageContent);
  
  if (author === 'Chat_Bot') {
    title.innerHTML = author;
    message.classList.add('chat--bot');
  }  else if (author === userName) {
    message.classList.add('message--self');
    title.innerHTML = 'You';
  } else {
    title.innerHTML = author;
  }
  
  messagesList.appendChild(message);
};

const sendMessage = function(event) {
  event.preventDefault();
  
  let messageContent = messageContentInput.value;
  
  if (messageContent !== '') {
    addMessage(userName, messageContentInput.value);

    socket.emit('message', { author: userName, content: messageContent });

    messageContentInput.value = '';
  } else {
    alert('The message field is empty');
  }
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);