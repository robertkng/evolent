import React from 'react';
import Link from 'react-router';
import './Contacts.css';

const Contacts = (props) => {
  const listOfContacts = props.contacts.map(contact => (
    <li key={contact.user_id} className="contact-item">
      <div className="contact-block">
        <span className="contact-name">{contact.first_name} {contact.last_name}</span>
        <Link className="contact-edit" to={`edit-contact/{contact.user_id`}>
          <i className="fa fa-pencil-square" aria-hidden="true" />
        </Link>
      </div>

      <div className="contact-block">
        <span>{contact.phone_number}</span>
        <button className="contact-delete" onClick={() => props.deleteContact(contact.user_id)}>
          <i className="fa fa-trash-o" aria-hidden="true" />
        </button>
      </div>
    </li>
    ));

  if(!props.contacts.length) {
    return <span className="no-contacts">No contacts have been saved.</span>;
  }

  return (
    <ul className="list-contacts">
      {listOfContacts}
    </ul>
  );
};

Contacts.propTypes = {
  contacts: React.PropTypes.array,
};
