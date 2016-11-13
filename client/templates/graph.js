Template.graph.onRendered(function() {
	var instance = this;
    var keys = [];
    var data = [];
    for (var key in this.data) {
    	keys.push(key.charAt(0).toUpperCase() + key.slice(1));
    	data.push(instance.data[key]);
    }
	var barChartData = {
	  labels: keys,
	  datasets: [{
	    fillColor: "rgba(0,60,100,1)",
	    strokeColor: "black",
	    data: data
	  }]
	}

	var index = 11;
	var ctx = this.find("canvas").getContext("2d");
	var barChartDemo = new Chart(ctx).Bar(barChartData, {
	  responsive: true,
	  barValueSpacing: 2
	});
});
