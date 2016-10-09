import { Meteor } from 'meteor/meteor';

var firebase = require('firebase');
firebase.initializeApp({
    apiKey: "AIzaSyDwvscYM2Mq55JOuF3REg2oK5P4vpdmCGk",
    authDomain: "health-me-299b8.firebaseapp.com",
    databaseURL: "https://health-me-299b8.firebaseio.com",
    storageBucket: "health-me-299b8.appspot.com",
    messagingSenderId: "11212122726"
});

Meteor.startup(() => {
  // code to run on server at startup
});

