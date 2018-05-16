import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }

componentDidMount() {
  this.socket = new WebSocket('ws://localhost:3001');

  this.socket.onopen = event => {

  }
  this.socket.onmessage = event => {
    console.log(event.data);

    const recievedMsg = JSON.parse(event.data);

    const newMsg = this.state.messages.concat(recievedMsg)
    this.setState({ messages: newMsg })
  }
}


addMessage = message => {
  const newMessage = {
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
        <ChatBar currentUser={this.state.currentUser} addMessage={this.addMessage} />
      </div>
    );
  }
}


export default App;
