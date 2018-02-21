import React, { Component } from 'react';
import Input from './commons/input.component';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    }
    this.onTextChange = this.onTextChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  async onKeyPress(e) {
    if(e.key === 'Enter') {
      const result = await fetch('http://localhost:8000/identity', {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const body = await result.json();
      console.log(body);

      if(body.token) {
        localStorage.setItem('token', JSON.stringify(body.token));
        localStorage.setItem('user', JSON.stringify(body.user));
        this.props.setLoginStatus(true);
      }
    }
  }
  onTextChange(e) {
    // console.log(e.target.name);
    // console.log(e.target.value);
    const currentState = Object.assign({}, this.state);
    if (e.target.name === 'username') {
      currentState.username = e.target.value;
    }

    if (e.target.name === 'password') {
      currentState.password = e.target.value;

    }

    this.setState(currentState, () => {
      console.log(this.state);
    });
  }
  
  render() {
    return (
      <div className="login--page">
        <h1>Hello i am from Login Page....</h1>
        <Input 
          hintText='Username'
          floatingLabelText='Username'
          onTextChange={this.onTextChange}
          onKeyPress={this.onKeyPress}
          name='username'
          />
        <Input
          hintText='Password'
          floatingLabelText='Password'
          onTextChange={this.onTextChange}
          onKeyPress={this.onKeyPress}
          name='password'
        />
      </div>
    )
  }
}

export default Login;
