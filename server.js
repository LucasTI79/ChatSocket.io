const express = require('express')
const path = require('path');
const engines = require('consolidate');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

module.exports = io;

const { routes, rooms } = require('./src/routes');

app.engine("ejs", engines.ejs);
app.set('views', path.join(__dirname, './src/views'));
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(routes);

server.listen(3000)

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}
