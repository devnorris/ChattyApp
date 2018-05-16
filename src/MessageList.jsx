import React, {Component} from 'react';
import Message from "./Message.jsx";

class MessageList extends React.Component {
  render() {
    const messageComponent= this.props.recieve.map((message, index) => {
      return (
        <Message username={message.username} content={message.content} key={message.id} />
      );
    });

    return (
      <main className='messages'>
        {messageComponent}
      </main>
    );
  }
}

export default MessageList;