import React, { Component } from 'react';
// import alertify from 'alertifyjs';
import { Link } from 'react-router';
// import Validations from '../../utils/validation';
import './Add.css';

const baseUrl = 'http://localhost:4000/api';

class Add extends Component {
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
      fetch(`${baseUrl}/single-contact/${params.user_id}`, {
        method: 'get',
      })
      .then(r => r.json())
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
    if (nextProps.params.user_id !== this.props.params.user_id) {
      this.resetContactForm(nextProps);
    }
  }

  // Update field values
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

  // Validate and update field values
  handleChange(fieldName, value, validationParams) {
    this.error = false;

    if (!this.state.touched) {
      this.setState({
        disabled: false,
        touched: true,
      });
    }

    if (validationParams !== undefined && validationParams.length) {
      for (let i = 0; i < validationParams.length; i += 1) {
        switch (validationParams[i]) {
          case 'required':
            this.error = Validations.required(value);
            this.updateField(fieldName, value, this.error);
            break;

          case 'alphabets':
            this.error = Validations.alphabets(value);
            this.updateField(fieldName, value, this.error);
            break;

          case 'email':
            this.error = Validations.email(value);
            this.updateField(fieldName, value, this.error);
            break;

          case 'numbers':
            this.error = Validations.numbers(value);
            this.updateField(fieldName, value, this.error);
            break;
          default:
            this.updateField(fieldName, value);
        }

        if (this.error) {
          break;
        }
      }
    } else {
      this.updateField(fieldName, value);
    }
  }

  // Reset contact form
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

  // Save Contact
  saveContact(ev) {
    ev.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
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
    const saveNotif = alertify.notify('Saving the contact. Please wait..', 'success', 0);

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
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          method: 'put',
          body: JSON.stringify(data),
        })
        .then(r => r.json())
        .then((res) => {
          saveNotif.dismiss();
          this.setState({
            disabled: false,
          });

          if (res.status === 'error') {
            alertify.alert('OOPS!!!', res.error, 'error');
            return false;
          }

          alertify.notify('Contact saved successfully.', 'success', 3);
          return true;
        })
        .catch(err => err);
      } else {
        fetch(`${baseUrl}/add-contact/`, {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify(data),
        })
        .then(r => r.json())
        .then((res) => {
          saveNotif.dismiss();

          if (res.status === 'error') {
            this.setState({
              disabled: false,
            });
            alertify.alert('OOPS!!!', res.error, 'error');
            return false;
          }

          alertify.notify('Contact saved successfully.', 'success', 3);
          this.resetContactForm(this.props);
          return true;
        })
        .catch(err => err);
      }
    } else {
      saveNotif.dismiss();
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
      <form className="contact-form" noValidate>
        <h2 className="contact-form-title">{this.props.params.user_id ? 'Edit Contact' : 'Add Contact'}</h2>

        <div className="contact-form-fields">
          <div className="contact-field-grp">
            <input
              type="text"
              placeholder="First Name"
              onChange={ev => this.handleChange(
                'firstName',
                ev.target.value,
                ['required', 'alphabets'],
              )}
              value={firstName.value}
              className="contact-input"
            />
            <span className="error">{firstName.error}</span>
          </div>

          <div className="contact-field-grp">
            <input
              type="text"
              placeholder="Last Name"
              onChange={ev => this.handleChange(
                'lastName',
                ev.target.value,
                ['required', 'alphabets'],
              )}
              value={lastName.value}
              className="contact-input"
            />
            <span className="error">{lastName.error}</span>
          </div>

          <div className="contact-field-grp">
            <input
              type="text"
              placeholder="Email"
              onChange={ev => this.handleChange(
                'email',
                ev.target.value,
                ['required', 'email'],
              )}
              value={email.value}
              className="contact-input"
            />
            <span className="error">{email.error}</span>
          </div>

          <div className="contact-field-grp">
            <input
              type="text"
              placeholder="Phone Number"
              onChange={ev => this.handleChange(
                'phoneNumber',
                ev.target.value,
                ['required', 'numbers'],
              )}
              value={phoneNumber.value}
              className="contact-input"
            />
            <span className="error">{phoneNumber.error}</span>
          </div>

          <div className="contact-field-grp contact-switch">
            <span className="switch-label inactive">{!status.value ? 'Inactive' : null}</span>
            <label className="switch" htmlFor="status">
              <input
                type="checkbox"
                onChange={ev => this.handleChange('status', ev.target.checked)}
                checked={status.value}
                id="status"
              />
              <div className="slider round" />
            </label>
            <span className="switch-label active">{status.value ? 'Active' : null}</span>
          </div>

          <div className="contact-field-grp contact-btns">
            <button
              className="save-contact contact-form-btn" disabled={disabled}
              onClick={this.saveContact}
            >
              Save Contact
            </button>
            <Link to="/" className="cancel-contact contact-form-btn">Cancel</Link>
          </div>
        </div>
      </form>
    );
  }
}

Add.propTypes = {
  params: React.PropTypes.object,
  user_id: React.PropTypes.string,
};

export default Add;
