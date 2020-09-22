const io = require('../server');

const rooms = { }

// let messages = [];

io.on('connection', socket => {
  socket.on('new-user', (room, phone) => {
    socket.join(room)
    console.log(rooms[room], 'sala que o usuário entrou')
    console.log(rooms[room][0],'info da sala')
    rooms[room][0] = { users: [ socket.id, phone ] }
    console.log(rooms[room][0], 'info da sala')
    // socket.emit('previousMessages',messages)
    // console.log(rooms[room],'sala')
    // console.log(rooms[room][0], 'sala no elemento 0 do array')
    // console.log(rooms[room].users, 'usuarios da sala')
    // console.log(messages,'mensagens na let')
    socket.to(room).broadcast.emit('user-connected', phone)
    
  })

  socket.on('send-chat-message', (room, message, phone) => {
       socket.to(room).broadcast.emit('chat-message', { message: message, name: phone })
      //  rooms[room][1] = mess
    // console.log(messages,'on io.js send-chat-message')
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room][0].users[0] === socket.id ? 'teste' : null)
      delete rooms[room][0].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room[0].users[socket.id] != null) names.push(name)
    return names
  }, [])
}

function getDataUserRoom(room){
  return null
}

  module.exports = {
      rooms,
      io
  }