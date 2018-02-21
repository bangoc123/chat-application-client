import React, { Component } from 'react';
import Login from './Login.component';
import App from './App';

class Main extends Component {
  constructor(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedin = (user && user._id) ? true : false;
    super(props);
    this.state = {
      isLoggedin: isLoggedin,
    }

    this.setLoginStatus = this.setLoginStatus.bind(this);
  }

  setLoginStatus(status) {
    const currentState = Object.assign({}, this.state);
    currentState.isLoggedin = status;
    this.setState(currentState);
  }

  render(){
    return (
      !this.state.isLoggedin ? <Login setLoginStatus={this.setLoginStatus} /> : <App/>
    )
  }
}

export default Main;
