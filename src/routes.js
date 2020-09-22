const express = require('express');
const routes = express.Router();

const { io, rooms } = require('./ioFunc')

routes.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

routes.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = [{ users: {} }, { messages: { } }]
  //console.log(rooms[req.body.room],'dados da sala criada')
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

routes.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

module.exports = {
    routes,
    rooms
};