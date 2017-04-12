const pgp = require('pg-promise');
const db = require('../lib/dbconnect');

function getAllContacts(req, res, next) {
  db.any(`SELECT * FROM contacts WHERE status=$1`, req.params.status)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
    });
  })
    .catch(err => next(err));
}

function createContact(req, res, next) {
  db.none(`INSERT INTO contacts (first_name, last_name, email, phone_number, status)` +
    `VALUES(${first_name}, {last_name}, ${email}, ${phone_number}, ${status}`, req.body)
  .then(() => {
    res.status(200)
    .json({
      status: 'Success',
      messaege: 'Contact enetered',
    });
  })
  .catch((err) => {
    res.status(500).send({
      error: err.detail,
      status: 'error',
    });
    next(err);
  });
}

function getSingleContact(req, res, next) {
  db.one(`SELECT * FROM contacts WHERE user_id=$1`, req.params.user_id)
  .then((data) => {
    res.status(200)
    .json({
      status: 'Success',
      data,
    });
  })
  .catch(err => next(err));
}

function editContact(req, res, next) {
  db.none(`UPDATE contacts SET first_name=$1, last_name=$2, email=$3, phone_number=$4, status=$5 WHERE user_id=$6`,
    [
    req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.status,
    parseInt(req.params.user_id, 10),
    ])
  .then(() => {
    res.status(200)
    .json({
      status: 'Success',
      message: 'Contact updated',
    });
  })
  .catch((err) => {
    res.status(500)
    .json({
      status: 'Error',
      message: err.detail,
    });
    next(err);
  });
}

function deleteContact(req, res, next) {
  db.result(`DELETE FROM contacts where user_id=$1`, req.params.user_id)
  .then(() => {
    res.status(200)
    .json({
      status: 'Success',
    });
  })
  .catch(err => next(err));
}

module.exports = {
  getAllContacts,
  createContact,
  getSingleContact,
  editContact,
  deleteContact,
};
