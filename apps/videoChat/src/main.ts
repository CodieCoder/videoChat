/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 3333; //serve port

const app = express();

app.use(cors());
const server = http.createServer(app); //the http server
//initialize socket.io
const io = new Server(server, {
  cors: { origin: `http://127.0.0.1/4200` },
});

//initialize socket.io connection
io.on('connection', (socket) => {
  console.log('Testee socket connected');

  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Testee socket disconnected');
  });
});

function error(err, req, res, next) {
  //log it
  if (!req) {
    console.log(err.stack);
  }

  //respond with 500 "Internal server error"
  res.status(500);
  res.send('Internal Server Error');

  // next()
}

app.use(error);
// server.listen;

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to videoChat!' });
});

// const port = process.env.PORT || 3333;
const connection = server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/api`);
});

connection.on('error', error);
