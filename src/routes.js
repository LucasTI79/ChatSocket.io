const express = require('express');
const routes = express.Router();
const io = require('../server');

const rooms = { }

routes.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

routes.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

routes.get('/:room', (req, res) => {
  console.log(req.params,'req.params')
//   console.log(rooms,'rooms')
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }

  res.render('room', { roomName: req.params.room })
})

module.exports = {
    routes,
    rooms
};