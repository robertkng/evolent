const validations = {
  required(value) {
    if (!value) {
      return 'This field is required';
    }
    return '';
  },

  alphabets(value) {
    if (!/^[a-zA-Z]+$/.test(value)) {
      return 'This field should only contain alphabets.';
    }
    return '';
  },

  email(value) {
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
      return 'Invalid email.';
    }
    return '';
  },

  numbers(value) {
    if (!/^[0-9]+$/.test(value)) {
      return 'This field should only contain numbers.';
    }
    return '';
  },
};

export default validations;
