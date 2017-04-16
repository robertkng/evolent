# Evolent

## Project Description:
Production ready application for maintaining contact information built with React, Node, PostgreSQL, Webpack, and Babel. 

### Features:
    - add a contact 
    - list contacts
    - edit contact
    - delete contact

### Required Contact model: 
    - First Name
    - Last Name
    - Email
    - Phone Number
    - Status (Possible values: Active/Inactive)

## Installation Instructions:

### First step is to create, connect and seed the database:
    - In your terminal, go to the directory of folder named evolent
    - Type psql postgres
    - Then type CREATE DATABASE evolent
    - Then type \c evolent 
    - Then type \i server/db/schema.sql 
    - Then type \i server/db/seed.sql 

### Next step is to install all the dependencies:

In the terminal run command: 
```
> npm install
```

### Run command in one console:
```
> npm run watch
```

### Run command in another console:
```
> nodemon server.js
```

### In your browser, type the address: http://localhost:3000/
