import React, { Component } from 'react';
import Nav from '../Nav/Nav.jsx';
import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      contacts: [],
      result: {},
    };
  }

  getAllContacts() {
    fetch('/contacts')
    .then(r => r.json())
    .then((results) => {
      this.setState({
        contacts: results.data,
      });
      // console.log(this.state);
    })
    .catch(err => err);
  }

  render() {
    return (
      <div className="App">
        <div className="nav">
          <Nav />
        </div>
        <div className="props">
          {this.props.children}

        </div>
      </div>
    );
  }
}


