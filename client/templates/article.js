Template.article.onCreated(function() {
	var instance = this;
	instance.analyzing = new ReactiveVar(false);
	instance.analysis = new ReactiveVar(false);
});
Template.article.helpers({
	analyzing: function() {
		return Template.instance().analyzing.get();
	},
	analysis: function() {
		return Template.instance().analysis.get();
	},
	date: function() {
		return moment(this.date).fromNow();
	},
	progClass: function(score) {
		if(score < 0) {
			return "progress-bar-danger";
		}
		return "progress-bar-success";
	}, 
	bias: function(score) {
		if(score < 0) {
			return "Negative";
		}
		return "Positive";
	}, 
	score: function(score) {
		if(score) {
			return ((1 + parseFloat(this.overall_sentiment_score))*100/2);
		}
	}
});
Template.article.events({
	'click .analyze': function(event, template) {
		template.analyzing.set(!template.analyzing.get());
	   	Meteor.call('get_website_analysis', template.data.url, function(error, result ){
			if (error){
				alert('Error');
			}
			return template.analysis.set(result);
		});
	},
	'load img': function(event, template) {
		$(event.target).removeClass('hidden');
  	}
});
