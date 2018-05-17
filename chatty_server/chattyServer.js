const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


const wss = new SocketServer({ server });

findColor = () => {
  const colors = ["#0000ff", "#52a002", "#883fe2", "#ff9928"];
  return colors[Math.floor(Math.random() * colors.length)];
}


wss.on('connection', (ws) => {
  console.log('Client connected');

  const colorCode = {
    type: "userColor",
    color: findColor()
  }

  ws.send(JSON.stringify(colorCode));


    const connClients = wss.clients.size;

    const numUsers = {
      type: "numberUsers",
      amount: connClients
    }

  wss.clients.forEach( client => {
    client.send(JSON.stringify(numUsers));
  });

  ws.on('message', (msg) => {
    console.log("recieved : ", (msg));

    const dataParsed = JSON.parse(msg);

      if (dataParsed.type === "postNotification") {
        dataParsed.type = "incomingNotification";
      } else if (dataParsed.type === "postMessage") {
        dataParsed.type = "incomingMessage";
      };

    dataParsed.id = uuidv4();

    wss.clients.forEach(client => {
        client.send(JSON.stringify(dataParsed));
    });

  });


  ws.on('close', () => {
    console.log('Client disconnected');

    const loggedOff = wss.clients.size;

    const disconnectUser = {
      type: "disconnected",
      amount: loggedOff
    };

    wss.clients.forEach( client => {
      client.send(JSON.stringify(disconnectUser))
    });

  });

});
