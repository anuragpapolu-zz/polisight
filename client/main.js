import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var firebase = require('firebase');
firebase.initializeApp({
	apiKey: "AIzaSyDwvscYM2Mq55JOuF3REg2oK5P4vpdmCGk",
	authDomain: "health-me-299b8.firebaseapp.com",
	databaseURL: "https://health-me-299b8.firebaseio.com",
	storageBucket: "health-me-299b8.appspot.com",
	messagingSenderId: "11212122726"
});

Template.appBody.onCreated(function helloOnCreated() {
	var instance = this;
	instance.user = new ReactiveVar(null);
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			instance.user.set(true);
		} else {
			instance.user.set(false);
		}
	});
});
Template.appBody.helpers({
	userLoading() {
		return Template.instance().user.get() ==null;
	},
	currentUser() {
		return Template.instance().user.get();
	}
});

Template.signin.onCreated(function() {
	this.signErrors = new ReactiveVar({});
	this.reg = new ReactiveVar(false);
});
Template.signin.helpers({
	errorMessages: function() {
		return _.values(Template.instance().signErrors.get());
	},
	errorClass: function(key) {
		return Template.instance().signErrors.get()[key] && 'error';
	},
	reg: function() {
		return Template.instance().reg.get();
	}
});
Template.signin.events({
	'click .goReg'(event, instance) {
		instance.reg.set(true);
	},
	'click .goLog'(event, instance) {
		instance.reg.set(false);
	},
	'submit .form-signin'(event, instance) {
		event.preventDefault();
		var email = instance.$('[name=email]').val();
		var password = instance.$('[name=password]').val();
		var errors = {};
		if (! email) {
			errors.email = 'Email required';
		}
		if (! password) {
			errors.password = 'Password required';
		}
		instance.signErrors.set(errors);
		if (_.keys(errors).length) {
			return;
		}
		if(instance.reg.get()) {
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
			});    	
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
			});
		}
	}
});

Template.home.onCreated(function helloOnCreated() {
	var instance = this;
	instance.user = new ReactiveVar(false);
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			instance.user.set(user);
		} else {
			instance.user.set(false);
		}
	});
	var ref = firebase.database().ref('Posts');
	ref.on("value", function(snapshot) {
		$(".nothing-here").show();
		$(".media").remove();
		snapshot.forEach(function(childSnapshot) {
			$(".nothing-here").hide();
			$(".nothing-here").after('<div class="media"><div class="media-left"><a href="#"><img alt="64x64" width="64px" class="media-object" src="' + childSnapshot.val().img + '" style="width: 64px; height: 64px;"></a></div><div class="media-body"><h4 class="media-heading">' + childSnapshot.val().name + '</h4>' + childSnapshot.val().msg + '</div></div>')
		});
	});

});
Template.home.helpers({
	currentUser() {
		return Template.instance().user.get();
	}
});
Template.home.events({
	'click .logout'(event, instance) {
		firebase.auth().signOut();
	}
});
