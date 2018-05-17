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

  const dataParsed = JSON.parse(msg);

    if (dataParsed.type === "postNotification") {
      dataParsed.type = "incomingNotification";
    } else if (dataParsed.type === "postMessage") {
      dataParsed.type = "incomingMessage";
    }

  // //sent postNOotication and postMessage to server and am splitting them up to change into incomingMessage and incomingNotification to send to client.
  // //Next thing to do is change the state in the client when recieving this data(incomingMessage, incomingNotification)
    dataParsed.id = uuidv4();

    wss.clients.forEach(client => {
      client.send(JSON.stringify(dataParsed));
    });
  });


  ws.on('close', () => console.log('Client disconnected'));
});
