import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      usersOnline: 1,
      color: "black"
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


    switch (recievedData.type) {
      case "numberUsers":
        this.setState({ usersOnline: recievedData.amount });
        break;
      case "disconnected":
        this.setState({ usersOnline: recievedData.amount });
        break;
      case "userColor":
        this.setState({ color: recievedData.color });
        break;
      default:
        console.log("This type is unkown.")
    }


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
    color: this.state.color,
    content: message
  };

  this.socket.send(JSON.stringify(newMessage));

  // const messages = this.state.messages.concat(newMessage)
  // this.setState({messages: messages})
}

  render() {
    return (
      <div>

      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <div>{ this.state.usersOnline } users online</div>
      </nav>

        <MessageList messages={ this.state.messages } />
        <ChatBar changeUser={ this.changeUser } addMessage={ this.addMessage } />

      </div>
    );
  }
}


export default App;
