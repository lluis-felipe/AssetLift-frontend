import React, { Component } from 'react';
import './App.scss';
import Login from './content/Login/Login';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Login/>
      </div>
    );
  }
}

export default App;
