'use strict';

const express = require('express');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
require('dotenv').config()
const routes = require('./routes.js')
const auth = require('./auth')

const app = express();
fccTesting(app); //For FCC testing purposes

app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));

/***************Connect to mongoDb****************/
const mongo = require('mongodb').MongoClient;
mongo.connect(process.env.MLAB_URL, (err, db) => {
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    //serialization and app.listen
  
  auth(app,db)
  routes(app, db)
  }
});