const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


const wss = new SocketServer({ server });

  // function that picks a color at random
  findColor = () => {
    const colors = ["#0000ff", "#52a002", "#883fe2", "#900700ed", "#ffc107", "#07ffec", "#5f07ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }


wss.on('connection', (ws) => {
  console.log('Client connected');

  const colorCode = { // assigns a color to a connected user
    type: "userColor",
    color: findColor()
  };

  ws.send(JSON.stringify(colorCode));

    const connClients = wss.clients.size;

    const numUsers = {
      type: "numberUsers",
      amount: connClients
    };

  wss.clients.forEach( client => {
    client.send(JSON.stringify(numUsers));
  });

  ws.on('message', (msg) => {

    const dataParsed = JSON.parse(msg);

    // changes the data from post to incoming for the client
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

// closes the connection when a user exits the app
// also sends the diconnected notification to change "users Online"
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
