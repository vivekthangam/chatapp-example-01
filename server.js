const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app=express();
const server =http.createServer(app);
const PORT = 3000||process.env.PORT;
const io = socketio(server);
const formatMessage = require('./utils/messages');
const { userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

app.use(express.static(path.join(__dirname,'public')));

const botname='Chatce Bot';
io.on('connection',socket =>{
    
    socket.on('joinRoom',({username,room})=>{

        const user =userJoin(socket.id,username,room);

        socket.join(user.room);

        socket.emit('message',formatMessage(botname,'Welcome to ChatCord!'));

        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(botname, `${user.username} has joined the chat`));
    
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })

        socket.on('chatMessage', (msg)=>{
            const _user = getCurrentUser(socket.id);

            io.to(_user.room).emit('message',formatMessage(_user.username,msg))
        });
        

        socket.on('disconnect',()=>{
            const _user = userLeave(socket.id);
            if(_user){
                io.to(user.room).emit('message',formatMessage(botname,`${_user.username} has left the chat`));
            }
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
                
        });
    
    });
    
    
});
server.listen(PORT,()=>console.log(`server running in port ${PORT}`));