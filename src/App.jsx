import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
      // notifications: ""
    };
  }

componentDidMount() {
  this.socket = new WebSocket('ws://localhost:3001');

  this.socket.onopen = event => {
    console.log("Connected to server");
  }
  this.socket.onmessage = event => {
    console.log("event: ", event);

    const recievedData = JSON.parse(event.data);
    console.log("type: ", recievedData.type)
    // if (recievedData.type === "incomingMessage") {
    //    const newMsg = this.state.messages.concat(recievedData);
    //     this.setState({ messages: newMsg });
    // } else if (recievedData.type === "incomingNotification") {
    //     const newNotifaction = this.state.currentUser.name(recievedData.username);
    //     this.setState({ currentUser: newNotifaction });
    // } else {
    //     throw new Error("Unknown event type " + recievedData.type);
    // }

      const newMsg = this.state.messages.concat(recievedData)
        this.setState({ messages: newMsg })

  };
};


changeUser = name => {

  const newNotifaction = {
    type: "postNotification",
    content: `${this.state.currentUser.name} changed thier name to ${name}.`
  };

  this.setState({
    currentUser: {name: name}
  });

  this.socket.send(JSON.stringify(newNotifaction));
};


addMessage = message => {
  const newMessage = {
    type: "postMessage",
    username: this.state.currentUser.name,
    content: message
  };

  this.socket.send(JSON.stringify(newMessage));

  // const messages = this.state.messages.concat(newMessage)
  // this.setState({messages: messages})
}

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages} />
        <ChatBar changeUser={this.changeUser} addMessage={this.addMessage} />
      </div>
    );
  }
}


export default App;
