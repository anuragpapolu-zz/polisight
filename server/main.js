import { Meteor } from 'meteor/meteor';

var DEFAULT_SOURCES = ["bbc-news", "cnn", "usa-today", "the-guardian-uk", "google-news", "the-washington-post", "time"];
var news_API_key = "d5164fc6eb62459cb7cc7d14bec9e525";
var IBM_WATSON_API_KEY = "14d6dd970495dfb0110c90ee2522ac24e311d4d4";


Meteor.methods({
	get_source_info : function(sources=DEFAULT_SOURCES) {
		var NEWS_API_SOURCES;
		HTTP.call("GET" , "https://newsapi.org/v1/sources?language=en", function(error, result) {
			if (error) {
				return
			} else {
				var NEWS_API_SOURCES = result.data;
				var RETURN_DICT = {};
				for (var i = 0, len = NEWS_API_SOURCES.sources.length; i < len;  i++) {
					if (sources.includes(NEWS_API_SOURCES.sources[i].id)) {
						RETURN_DICT[NEWS_API_SOURCES.sources[i].id] = {};
						RETURN_DICT[NEWS_API_SOURCES.sources[i].id]["name"] = NEWS_API_SOURCES.sources[i].name;
						RETURN_DICT[NEWS_API_SOURCES.sources[i].id]["main_source_url"] = NEWS_API_SOURCES.sources[i].url;
						RETURN_DICT[NEWS_API_SOURCES.sources[i].id]["logo"] = NEWS_API_SOURCES.sources[i].urlsToLogos.large;
					}
				}

				console.log(RETURN_DICT);	
			}
		});
	},

	get_articles : function(sources=DEFAULT_SOURCES) {
		var RETURN_DICT = [];
		for (var i = 0, len1 = sources.length; i<len1; i++) {  			
			var result_from_call = HTTP.call("GET" , "https://newsapi.org/v1/articles?source=" + sources[i] + "&apiKey=" + news_API_key);
			var articles_for_current_source = result_from_call.data.articles;
			for (var x=0, len2 = articles_for_current_source.length; x<len2; x++) {
				RETURN_DICT.push({
					"author": articles_for_current_source[x].author,
					"title": articles_for_current_source[x].title,
					"summary": articles_for_current_source[x].description,
					"url": articles_for_current_source[x].url,
					"urlToImage": articles_for_current_source[x].urlToImage,
					"source": sources[i],
					"date": articles_for_current_source[x].publishedAt
				});
			}
		}
		if(RETURN_DICT.length % 2 == 0) {
			return [RETURN_DICT.slice(0, RETURN_DICT.length/2), RETURN_DICT.slice(RETURN_DICT.length/2, RETURN_DICT.length)]
		} else {
			return [RETURN_DICT.slice(0, RETURN_DICT.length/2 + 1), RETURN_DICT.slice(RETURN_DICT.length/2 + 1, RETURN_DICT.length)]
		}
	}, 
	get_website_analysis : function(website='http://www.bbc.com/news/election-us-2016-37953528') {
		var RETURN = []
		var url = 'https://gateway-a.watsonplatform.net/calls/url/URLGetRankedNamedEntities?apikey=' + IBM_WATSON_API_KEY;
		var rv = HTTP.call( 'POST', url, { 'params': {
			'maxRetrieve' : 3,
			'outputMode'  : 'json',
			'emotion'     : 1,
			'sentiment'   : 1,
			'sourceText'  : "cleaned_or_raw",
			'url': website
		  	} /*headers: {
       			'Content-Type': 'application/x-www-form-urlencoded'
       		}*/});

			totaler = 0
			for (var i = 0, len = rv.data.entities.length; i < len; i++) {
				RETURN.push({
					"name": rv.data.entities[i].text,
					"overall_sentiment_score": rv.data.entities[i].sentiment.score,
					"emotions": rv.data.entities[i].emotions
				});
			}
			return RETURN;
		}
	});
