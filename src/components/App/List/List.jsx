import React, { Component } from 'react';
import Contacts from './Contacts/Contacts.jsx';
import './List.css';

export default class List extends Component {

  const contacts = props.state.contacts.map((render, index) => {
      return (
        <Contacts
          <ul key={index} className="list-container">
            <li>{render.first_name}</li>
            <li>{render.last_name}</li>
            <li>{render.email}</li>
            <li>{render.phone_number}</li>
            <li>{render.status}</li>
          </ul>
        />
      );
    });

    return (
      <div className="contacts">
        <br/>
        <h1>All Contacts</h1>
        {contacts}
      </div>
    );
  }
