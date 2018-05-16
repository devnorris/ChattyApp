import React, {Component} from 'react';

class ChatBar extends React.Component {

captureText = event => {
  if( event.key === "Enter" ) {
  this.props.addMessage(event.target.value);
  event.target.value = "";
  }
}

  render() {
    return (
      <footer className="chatbar">
        <input
            className="chatbar-username"
            defaultValue={this.props.currentUser.name}
        />
        <input
            className="chatbar-message"
            placeholder="Type a message and hit ENTER"
            onKeyPress={this.captureText}
        />
      </footer>
    );
  }
}


export default ChatBar;