const express = require('express')
const path = require('path');
const engines = require('consolidate');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

module.exports = io;

const { routes } = require('./src/routes');

app.engine("ejs", engines.ejs);
app.set('views', path.join(__dirname, './src/views'));
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(routes);

server.listen(3000)
