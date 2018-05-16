const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


const wss = new SocketServer({ server });


wss.on('connection', (ws) => {
  console.log('Client connected');



  ws.on('message', (msg) => {
    console.log("recieved : ", (msg));

  const messageParsed = JSON.parse(msg);

    wss.clients.forEach(client => {
      // console.log("client: ", client);
      messageParsed.id = uuidv4();
      client.send(JSON.stringify(messageParsed));
    });
  });


  ws.on('close', () => console.log('Client disconnected'));
});
