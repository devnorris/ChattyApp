import React, {Component} from 'react';
import Message from "./Message.jsx";

class MessageList extends React.Component {
  render() {
    const messageConponent= this.props.messages.map((message, index) => {
      return (
        <Message username={message.username} content={message.content} key={message.id} />
      );
    });

    return (
      <main className='messages'>
        {messageConponent}
      </main>
    );
  }
}

export default MessageList;