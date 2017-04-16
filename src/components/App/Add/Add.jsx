import React, { Component } from 'react';
import { Link } from 'react-router';
import alertify from 'alertifyjs';
// import Validations from '../../utils/validation';
import './Add.css';

const baseUrl = 'http://localhost:4000/api';

export default class Add extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: {
        value: '',
        error: '',
      },
      lastName: {
        value: '',
        error: '',
      },
      email: {
        value: '',
        error: '',
      },
      phoneNumber: {
        value: '',
        error: '',
      },
      status: {
        value: true,
      },
      disabled: !props.params.user_id,
      touched: false,
    };
    this.saveContact = this.saveContact.bind(this);
    this.error = false;
  }

  componentWillMount() {
    const { params } = this.props;

    if (params.user_id) {
      fetch(`{baseUrl}/single-contact/${params.user_id}`, {
        method: 'GET',
      })
      .then(r => r.json)
      .then((response) => {
        const data = response.data;

        this.setState({
          firstName: {
            value: data.first_name,
          },
          lastName: {
            value: data.last_name,
          },
          email: {
            value: data.email,
          },
          phoneNumber: {
            value: data.phone_number,
          },
          status: {
            value: data.status === 'Active',
          },
        });
      })
      .catch(err => err);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.user_id !== this.props.params.user_id) {
      this.resetContactForm(nextProps);
    }
  }

  updateField(fieldName, value, error) {
    const updateFieldVal = {
      [fieldName]: {
        value,
      },
    };

    if (error) {
      updateFieldVal[fieldName].error = error;
    }
    this.setState(updateFieldVal);
  }

  // handleChange(fieldName, value, validationParams) {
  //   this.error = false;

  //   if(!this.state.touch) {
  //     this.setState ({
  //       disabled: false,
  //       touched: true,
  //     });
  //   }

  //   if (validationParams !== undefined && validationParams.length) {
  //     for (let i = 0; i < validationParams.length; i += 1) {
  //       switch (validationParams[i]) {
  //         case 'required':
  //           this.error = Validations.required(value);
  //           this.updateField(fieldName, value, this.error);
  //           break;

  //         case 'alphabets':
  //           this.error = Validations.alphabets(value);
  //           this.updateField(fieldName, value, this.error);
  //           break;

  //         case 'email':
  //           this.error = Validations.email(value);
  //           this.updateField(fieldName, value, this.error);
  //           break;

  //         case 'numbers':
  //           this.error = Validations.alphabets(value);
  //           this.updateField(fieldName, value, this.error);
  //           break;
  //         default:
  //           this.updateField(fieldName, value);
  //       }

  //       if (this.error) {
  //         break;
  //       }
  //     }
  //   } else {
  //     this.updateField(fieldName, value);
  //   }
  // }

  resetContactForm(props) {
    this.setState({
      firstName: {
        value: '',
        error: '',
      },
      lastName: {
        value: '',
        error: '',
      },
      email: {
        value: '',
        error: '',
      },
      phoneNumber: {
        value: '',
        error: '',
      },
      status: {
        value: true,
      },
      touched: false,
      disabled: !props.params.user_id,
    });
  }

  saveContact(ev) {
    ev.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phoneNunber,
    } = this.state;

    const status = this.state.status.value ? 'Active' : 'Inactive';

    const fields = [
    {
      name: 'firstName',
      validate: ['required', 'alphabets'],
    },
    {
      name: 'lastName',
      validate: ['required', 'alphabets'],
    },
    {
      name: 'email',
      validate: ['required', 'email'],
    },
    {
      name: 'phoneNumber',
      validate: ['required', 'numbers'],
    },
    ];
    let data = {};
    const saveNotif = alertify.notify('Saving the contact. Please wait..', 'Success', 0);

    this.setState({
      disabled: true,
    });
    for (let i = 0; i < fields.length; i += 1) {
      this.handleChange(fields[i].name, this.state[fields[i].name].value, fields[i].validate);
    }

    if (!this.error) {
      data = {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        phone_number: phoneNumber.value,
        status,
      };

      if (this.props.params.user_id) {
        fetch(`${baseUrl}/edit-contact/${this.props.params.user_id}`, {
          heders: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(data),
        })
        .then(r => r.json)
        .then((res) => {
          saveNotif.dismiss();
          this.setState({
            disabled: false,
          });

          if (res.status === 'error') {
            alertify.alert('Error message:', res.error, 'Error');
            return false;
          }

          alertify.notify('Contact saved successfully.', 'Success', 3);
          return true;
        })
        .catch(err => err);
      } else {
        fetch(`${baseUrl}/add-contact/`, {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(data),
        })
        .then(r => r.json())
        .then((res) => {
          saveNotif.dismiss();

          if (res.status === 'error') {
            this.setState({
              disabled: false,
            });
            alertify.alert('Error message:', res.error, 'Error');
            return false;
          }
          alertify.notify('Contact saved successfully.', 'Success', 3);
          this.resetContactForm(this.props);
          return true;
        })
        .catch(err => err);
      }
    } else {
      saveNotif.dismiss();
    }
  }

  updateFirstName(e) {
    this.setState({
      firstName: {
        value: e.target.value,
      }
    })
  }

  updateLastName(e) {
    this.setState({
      lastName: {
        value: e.target.value,
      }
    })
  }

  updateEmail(e) {
    this.setState({
      email: {
        value: e.target.value,
      }
    })
  }

  updatePhoneNumber(e) {
    this.setState({
      phoneNumber: {
        value: e.target.value,
      }
    })
  }


  alpha(e) {
    const values = /[a-zA-Z]+/g;
    if(!values.test(e.key)) {
      e.preventDefault();
    }
  }

  numeric(e) {
    const values = /[0-9]+/g;
    if(!values.test(e.key)) {
      e.preventDefault();
    }
  }

  alphaNumeric(e) {
    const values = /[0-9a-zA-Z@.]+/g;
    if(!values.test(e.key)) {
      e.preventDefault();
    }
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      status,
      disabled,
    } = this.state;

    return (
      <form className="contact-form" noValidated>

        <div className="contact-form-fields">
          <div className="contact-form-grp">

            <br/>
            <h1>Add Contact Information</h1>
            <div className="first-name">
            First Name*
            <br/>
              <input
                id="first-name"
                type="text"
                maxLength="50"
                onChange={this.props.updateFirstName}
                value={firstName.value}
                onKeyPress={(e) => this.alpha(e)}
                className="form"
              />
            </div>
            <br/>

            <div className="last-name">
            Last Name*
            <br/>
              <input
                id="last-name"
                type="text"
                maxLength="50"
                onChange={ev => this.handleChange(
                  'lastName',
                  ev.target.value,
                  ['required', 'alphabets'],
                )}
                value={lastName.value}
                onKeyPress={(e) => this.alpha(e)}
                className="form"
              />
            </div>
            <br/>

            <div className="email">
            Email*
            <br/>
              <input
                id="email"
                type="text"
                maxLength="50"
                onChange={ev => this.handleChange(
                  'email',
                  ev.target.value,
                  ['required', 'email'],
                )}
                value={email.value}
                onKeyPress={(e) => this.alphaNumeric(e)}
                className="form"
              />
            </div>
            <br/>

            <div className="phone-number">
            Phone Number*
            <br/>
              <input
                id="phone-number"
                type="text"
                maxLength="10"
                onChange={ev => this.handleChange(
                  'phoneNunber',
                  ev.target.value,
                  ['required', 'numbers']
                )}
                value={phoneNumber.value}
                onKeyPress={(e) => this.numeric(e)}
                className="form"
              />
            </div>
            <br/>

            <div className="status">
            Status
            <br/>
              <select
                valueLink="{this.linkState('val')}"
                className="form">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>



            <button
              id="onclick"
              disabled={disabled}
              onClick={this.saveContact}
            >SUBMIT
            </button>
            <Link to="/" className="cancel-contact cancel-form-btn">Cancel</Link>
          </div>
        </div>
      </form>
    );
  }
  };

Add.propTypes = {
  params: React.PropTypes.object,
  user_id: React.PropTypes.string,
};

