const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

const {username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
} );

console.log(username,room);
const socket = io();

socket.emit('joinRoom',{username,room});

socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUserName(users);
});
socket.on('message',message=>{ 
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
});

//Message Submit

chatForm.addEventListener('submit',e =>{
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage',msg);
  e.target.elements.msg.value='';
  e.target.elements.msg.focus();
});

function outputMessage(message){
  console.log(message);
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML =`<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);

}
function outputRoomName(room){
roomName.innerText =room;
}
function outputUserName(users){
console.log(users);
  roomUsers.innerHTML =`
${users.map(user=>`<li>${user.username}<li>`).join()}`
  }