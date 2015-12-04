//on change in input, trigger filtration
$("#search-input-scatter").on('input', function() {
	var data = $("#search-input-scatter").val();
	filterDotsByName(data);
	validate(data);
});

$("#search-input").on('input', function() {
	var data = $("#search-input").val();
	validate(data);
});

function filterDotsByName(input) {
	//removes pokemon whose name do not start with the inputted text
	svg.selectAll(".dot")
	.filter(function(d) {
		var dname = d["Name"].toUpperCase();
		input = input.toUpperCase();
		return !dname.startsWith(input);})
	.transition()
	.duration(200)
	.delay(200)
	.style("visibility", 'hidden');

	//returns pokemon whose names do start with the inputted text
	svg.selectAll(".dot")
	.filter(function(d) {
		var dname = d["Name"].toUpperCase();
		input = input.toUpperCase();
		return dname.startsWith(input);})
	.transition()
	.duration(200)
	.delay(200)
	.style("visibility", 'visible');

}

//code borrowed from http://blog.miroslavpopovic.com/2012/06/23/jqueryui-autocomplete-filter-words-starting-with-term/
//rewrites jquery autocomplete filter to return only terms that start with the search input
$.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
    return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
    });
};

//jquery ui autocomplete function
$("#search-input").autocomplete({
	source: names,
	select: function() {
		$("#search-button").prop("disabled", false);
	}
});

$("#search-input-scatter").autocomplete({
	source: names,
	select: function() {
		$("#search-button").prop("disabled", false);
	}
});

$("#eggGroupPokemon").autocomplete({
	source: names
});

//validates search data
function validate(data) {
	if (inArray(data, names)) {
		$("#search-button").prop("disabled", false);
	} else {
		$("#search-button").prop("disabled", true);
	}
};

//helper function to see if value is in array, ignoring case
function inArray(val, arr) {
	val = val.toUpperCase();
	for (var i = 0; i < arr.length; i++) {
		var name = arr[i].toUpperCase();
		if (name == val) {
			return true;
		}
	}
	return false;
 }

//on search submit
$("#search").submit(function (event) {
	location.href = "pokemonPage.html";
	var input = $("#search-input").val().toUpperCase();
	d3.csv("assets/data/pokemon_stats.csv", function(error, data) {
	data = data.filter(function(d) {
		var name = d["Name"].toUpperCase();
		if (input == name) {
			localStorage.setItem("storageJSON", JSON.stringify($("#search-input").val()));
			localStorage.setItem("storageJSON", JSON.stringify(d));
		}
	});
	});
	event.preventDefault();
});

$("#search-scatter").submit(function (event) {
	location.href = "pokemonPage.html";
	var input = $("#search-input-scatter").val().toUpperCase();
	d3.csv("assets/data/pokemon_stats.csv", function(error, data) {
	data = data.filter(function(d) {
		var name = d["Name"].toUpperCase();
		if (input == name) {
			localStorage.setItem("storageJSON", JSON.stringify($("#search-input-scatter").val()));
			localStorage.setItem("storageJSON", JSON.stringify(d));
		}
	});
	});
	event.preventDefault();
});
