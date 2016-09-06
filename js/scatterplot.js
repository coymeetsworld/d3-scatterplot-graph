$(document).ready(function() {

	function buildXAxis(x, callback) {
		chart.append("g")
				 .attr("transform", "translate(0," + chartHeight + ")")
				 .call(d3.axisBottom(x).tickFormat(callback));

		//Add text label for x-axis
		chart.append("text")
				 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight+20+20) + ")")
				 .style("text-anchor", "middle")
				 .style("color", "white")
				 .text("Minutes behind Fastest Time");
	}

	function buildYAxis(y) {
		chart.append("g").call(d3.axisLeft(y));

		//Add Text label for the y-axis
		chart.append("text")
				 .attr("transform", "rotate(-90)")
				 .attr("y", -70)
				 .attr("x", -25)
				 .attr("dy", "2em")
				 .style("text-anchor", "middle")
				 .text("Ranking");
	}

	var chartWidth = 1000;
	var chartHeight = 500;

	var x = d3.scaleTime().range([0, chartWidth]);
	var y = d3.scaleLinear().range([chartHeight, 0]);
	var chart = d3.select('.chart').attr("width", chartWidth).attr("height", chartHeight).append("g").attr("transform", "translate(" + 20 + "," + 20 + ")");

	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(error, cyclistData) {

		if (error) throw error;

		console.log(cyclistData);

		y.domain(d3.extent(cyclistData, function(d) { return d.Place }).reverse());
		console.log(d3.extent(cyclistData, function(d) { return d.Seconds }));

		var formatTime = d3.timeFormat("%M:%S"),
			formatSeconds = function(d) { return formatTime(new Date(2016, 0, 1, 0, 0, d)); };
		var min = d3.min(cyclistData, function(d) { return d.Seconds} );
		var max = d3.max(cyclistData, function(d) { return d.Seconds} );

		var shortestTime = d3.min(cyclistData, function(d) { return formatSeconds(d.Seconds)} );
		var longestTime = d3.max(cyclistData, function(d) { return formatSeconds(d.Seconds)} );
		console.log("Shortest Time: " + shortestTime);
		console.log("Longest Time: " + longestTime);

		x.domain([max-min, 0]);

		cyclistData.forEach(function (d) {
			console.log(d.Name);
			console.log(formatSeconds(d.Seconds));
		});


		buildYAxis(y);
		buildXAxis(x, formatSeconds);

	});


});
