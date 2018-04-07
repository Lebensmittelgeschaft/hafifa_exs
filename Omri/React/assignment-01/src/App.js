import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UserInput from './UserInput/UserInput';
import UserOutput from './UserOutput/UserOutput';

class App extends Component {
  state = { 
    users:[
      {username:"Omri"},
      {username:"Ohad"},
      {username:"Idan"},
      {username:"Adi"},
    ],
    showPersons:false,
  }

  usernameChangedHandler = (event) => {
    this.setState({
      users:[
        {username:event.target.value},
        {username:"Ohad"},
        {username:"Idan"},
        {username:"Adi"},
      ],
    });
  }


  render() {
    return (
      <div className="App">
        <UserOutput username={this.state.users[0].username}></UserOutput>
        <UserOutput username={this.state.users[1].username}></UserOutput>
        <UserOutput username={this.state.users[2].username}></UserOutput>
        <UserOutput username={this.state.users[3].username}></UserOutput>
        <UserInput value={this.state.users[0].username} changed={this.usernameChangedHandler}></UserInput>
      </div>
    );
  }
}

export default App;
