import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import openSocket from 'socket.io-client';
import Message from './Message.component';
import Login from './Login.component';
import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';


let socket;

class App extends Component {

  constructor() {
    super()
    const user = JSON.parse(localStorage.getItem('user'));
    this.state = {
      rooms: [],
      currentInput: '',
      currentRoom: '',
      isLoggedin: false,
      currentUser: user,
      users: []
    }
    console.log('Constructor is working');
  }
  
  componentWillMount() {
    console.log('Will mount working');
    // Init socket
    socket = openSocket('http://localhost:8000');

    const onlineMessage = {
      TYPE: 'SET_ONLINE',
      user: this.state.currentUser,
    }
    socket.emit('rooms-central', onlineMessage);

    socket.on('newMessages', (data) => {
      // console.log(this.state.currentRoom);

      const currentState = Object.assign({}, this.state);
      const currentRoom = Object.assign({}, this.state.currentRoom);
      const currentMessages = Object.assign([], this.state.currentRoom.messages);

      // console.log('======currentMessages', currentMessages);
      currentMessages.push(data.data);
      currentRoom.messages = currentMessages;
      currentState.currentRoom = currentRoom;

      this.setState(currentState, () => {
        this.scrollToBottom();
        console.log('===Working good...', this.state.currentRoom.messages);
      });

    })

    
  }
  async componentDidMount() {
    try {

      const roomRes = await fetch('http://localhost:8000/rooms');
      const roomBody = await roomRes.json();
      const rooms = roomBody.data;

      const userRes = await fetch('http://localhost:8000/users');
      const userBody = await userRes.json();
      const users = userBody.data;
      console.log('users', users);

      const currentState = Object.assign({}, this.state);
      this.setState(Object.assign(currentState, { rooms: rooms, users }), () => {
        this.scrollToBottom();

        socket.on('onlineStatus', (data) => {
          console.log('onlineStatus', data);
          console.log('currentUsers', this.state.users);
    
          const currentState = Object.assign({}, this.state);
          const currentUsers = Object.assign([], this.state.users);
    
          const index = currentUsers.findIndex(user => user._id === data.user._id);
          console.log('index', index);
          const userToUpdate = Object.assign({}, currentUsers[index]);
          
          
          userToUpdate.online = true;
          currentUsers[index] = userToUpdate;
          currentState.users = currentUsers;
          
          this.setState(currentState);
    
        })
        
      })

      


      // Why 

      // this.state.rooms = rooms;

      
    } catch (e) {
      console.log(e);
    }
  }

  async handleClick (item) {
    console.log(item);
    const roomDetail = await fetch(`http://localhost:8000/rooms/${item._id}`, {
      method: 'GET',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhbmdvYyIsImlhdCI6MTUxNzUzNjQzOSwiZXhwIjoxMDAwMDAwMDAwMTUxNzUzNzAwMH0.aKhrVZiZrKZNHMfJNGjJmbMJbAe0Am8zMTOJFRIjlgo'
      })
    });
    const roomDetailBody = await roomDetail.json();
    // console.log('=====Responsse', roomDetailBody);

    // Set current Room.
    const currentState = Object.assign({}, this.state);
    currentState.currentRoom = roomDetailBody;
    this.setState(currentState, () => {
      console.log('=====Current Room', this.state.currentRoom);

      const joinRoomMessage = { TYPE: 'JOIN_ROOM', ROOM_ID: item._id }
      socket.emit('rooms-central', joinRoomMessage);
      this.scrollToBottom();
    });


  }

  sendMessage(e) {
    // console.log(e.key);
    if (e.key === 'Enter') {
      // Send message.
      const currentInput = this.state.currentInput;
      const user = JSON.parse(localStorage.getItem('user'));
      const message = { 
        TYPE: 'SEND_MESSAGE', 
        SENT_TO: this.state.currentRoom._id, 
        OWNER: user,
        currentInput,
      }
      socket.emit('messages-central', message);
    }
  }

  onTextChange (e) {
    const currentState = Object.assign({}, this.state);
    currentState.currentInput = e.target.value;
    this.setState(currentState, () => {
      console.log(this.state.currentInput);
    });

  }
  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    console.log('Render working', this.state.currentRoom.messages);
    const { messages } = this.state.currentRoom;


    const messagesHTML = messages && messages.map(message => <Message message={message} currentUser={this.state.currentUser} />);
    const roomsHTML = this.state.rooms.map(item => <ListItem
      primaryText= {item.name}
      onClick = { (e) => this.handleClick(item, e) }
    />)
    const usersHTML = this.state.users.map(user => 
    <ListItem leftAvatar={<Avatar 
      src={user.avatar}/>} 
      primaryText={user.username}
      rightIcon={<div className="chat-icon"> 
          <div className="chat-icon__content" style={{ backgroundColor: user.online ? '#81df6a' : '#8d908c' }}></div>
        </div>}
      />)
    return (
      <MuiThemeProvider>
        <div className="App">
          <Drawer>
            { roomsHTML }
          </Drawer>
            <div className="main-container" ref={(div) => {
              this.messageList = div;
            }}>
              <div className="messages">
                
                <div className="message">
                { messagesHTML }
                </div>
              </div>
            <input type="text" 
            className="message--input" 
            onChange = { (e) => this.onTextChange(e)}
            onKeyPress={(e) => this.sendMessage(e)}
            value={ this.state.currentInput }
            />
            <div className="users-online">
              {
                usersHTML
              }
            </div>  
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}


export default App;
