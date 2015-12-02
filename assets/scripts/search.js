$("#search-input").on('input', function() {
	var data = $("#search-input").val();
	filterByName(data);
});

function filterByName(input) {
	svg.selectAll(".dot")
	.filter(function(d) {
		var dname = d["Name"].toUpperCase();
		input = input.toUpperCase();
		console.log(dname.startsWith(input));
		return !dname.startsWith(input);})
	.transition()
	.duration(200)
	.delay(200)
	.style("visibility", 'hidden');
}
