import React, { Component } from 'react';

class Message extends Component {
  constructor(props) {
    super(props)
    console.log(this.props);
  }

  render(){
    const  { message, currentUser } = this.props;
    return (
      <div className="message">
        <div className="message__body">
          <div className="message__body__ava" style={{ backgroundImage: `url(${message.owner.avatar})` }} >
          
          </div>
          <div className="message__body__content" style={{ background: currentUser._id === message.owner._id ? '#13cbcf' : '#e3a1f2' }}>
            <span>{ message.content }</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Message;
