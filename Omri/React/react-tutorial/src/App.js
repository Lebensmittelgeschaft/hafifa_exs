import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state ={
    persons:[
      {name:"Omri",age:21},
      {name:"Ido",age:21},
      {name:"Idan",age:21},
      {name:"Ohad",age:21},
    ],
    showPersons:false,
    
  }


  switchNameHandler = (newName)=>{
    console.log('Was clicked!');
  //Dont Do This  this.state.persons[0].name="Haber";
  this.setState({persons:[
    {name:newName,age:22},
    {name:"Ido",age:23},
    {name:"Idan",age:24},
    {name:"Ohad",age:25},
  ]})
  }

  nameChangedHandler  = (event)=>{
    console.log('Was clicked!');
  //Dont Do This  this.state.persons[0].name="Haber";
  this.setState({persons:[
    {name:"Omri",age:22},
    {name:"Ido",age:23},
    {name:event.target.value,age:24},
    {name:"Ohad",age:25},
  ]})
  }
  togglePersonsHandler = ()=>{
    console.log('hi');
    this.setState({
      showPersons:!this.state.showPersons,
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="App-intro">IDK</p>
        <button onClick={this.togglePersonsHandler.bind(this)}>Toggle Persons</button>
        <button onClick={this.switchNameHandler.bind(this,"Haber")}>Switch Name</button>
        <p>{this.state.showPersons+""}</p>
   { this.state.showPersons?    
      <div>
          <Person 
          name={this.state.persons[0].name} 
          age ={this.state.persons[0].age}
          click = {this.switchNameHandler.bind(this,"Omri")}
          >My Hobbies: Cooking
          </Person>
          <Person 
            name={this.state.persons[1].name} 
          age ={this.state.persons[1].age}
          >
          </Person>
          <Person 
            name={this.state.persons[2].name} 
          age ={this.state.persons[2].age}
          changed={this.nameChangedHandler}>
          </Person>
          <Person 
          name={this.state.persons[3].name} 
          age ={this.state.persons[3].age}>
          </Person>
        </div>:null}

      </div>
    );
    //return React.createElement('div',{className:'App'},React.createElement('h1',null,'Some Header'))
  }
}

export default App;
