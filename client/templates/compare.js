Template.compare.onCreated(function() {
   	var instance = this;
   	instance.analyzing = new ReactiveVar(false);
   	instance.selectTwo = new ReactiveVar(false);
   	instance.articles = new ReactiveVar([]);
	Meteor.call('get_articles', function(error, result ){
		if (error){
			alert('Error');
		} else {
			instance.articles.set(result);
		}
	});
});
Template.compare.helpers({
  analyzing: function() {
    return Template.instance().analyzing.get();
  },
  selectTwo: function() {
    return Template.instance().selectTwo.get();
  },
  firstColumn: function() {
  	return Template.instance().articles.get()[0];
  },
  secondColumn: function() {
  	return Template.instance().articles.get()[1];
  },
});
Template.compare.events({
  	'click .analyze': function(event, template) {
    	template.analyzing.set(!template.analyzing.get());
  	},
	'change [type=radio]': function(event, template) {
    	template.selectTwo.set(($(event.target).val() == "true"));
  	},
	'change [type=checkbox]': function(event, template) {
		var checkedBoxlength=$(':checkbox:checked').length;
    	if(checkedBoxlength>2){
        	$(event.target).attr('checked', false);
    	} else if(checkedBoxlength < 2){ 
    		$(event.target).attr('checked', true);
    	}
  	},
  	'click .save-changes': function(event, template){ 
  		template.articles.set([]);
  		if(template.selectTwo.get()) {
  			var sources = $('input:checkbox:checked').map(function () { return this.value; }).get();
			Meteor.call('get_articles', sources, function(error, result ){
				if (error){
					alert('Error');
				} else {
					template.articles.set(result);
				}
			});
  		} else {
			Meteor.call('get_articles', function(error, result ){
				if (error){
					alert('Error');
				} else {
					template.articles.set(result);
				}
			});  			
  		}
  	}
});
