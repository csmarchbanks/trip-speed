import React, { Component } from 'react';
import './App.css';
import Munter from './Munter';

class App extends Component {
  render() {
    const defaultLegs = [{ speed: 4, distance: 8, elevation: 500 }];
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Munter Time Calculation</h1>
        </header>
        <p className="App-intro">
        </p>
        <Munter defaultLegs={defaultLegs}></Munter>
      </div>
    );
  }
}

export default App;
