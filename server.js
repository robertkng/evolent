'use strict'
require('dotenv').config({ silent: true });
const express       = require('express');
const morgan        = require('morgan');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const http          = require('http');
const db            = require('./models/contacts.js');
const app           = express();
const PORT          = process.argv[2] || process.env.PORT || 4000;

const router = new express.Router();
router.get('/contacts/:status', db.getAllContacts);
router.get('/single-contact/:user_id', db.getSingleContact);
router.post('/add-contact', db.createContact);
router.put('./edit-contact/:user_id', db.editContact);
router.delete('./contact/:user_id', db.deleteContact);

app.use(morgan(':method :url :date :remote-addr :status :response-time'));

// app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'dist')));

app.use(cookieParser());

app.use(bodyParser.json());

app.use('/api', router);
// app.use('/', require('./routes/contacts'));

app.listen(PORT, () => console.log('server is listening on ', PORT));
