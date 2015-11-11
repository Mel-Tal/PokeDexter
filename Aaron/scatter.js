var margin = {top: 20, right: 20, bottom: 20, left: 30};
var width = 1000 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

// pre-cursors
var sizeForCircle = function(d) {
  return 0.1 * d[document.getElementById("dotSize").value];
}

// setup x
var xValue = function(d) { return d[document.getElementById("XAxis").value];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d[document.getElementById("YAxis").value];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");


// add the graph canvas to the body of the webpage
var svg = d3.select(".scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var infobox = d3.select("body").append("div")
	.attr("class", "infobox")
	.style("opacity", 0);


	
// load data
d3.csv("pokemon_stats.csv", function(error, data) {
	data = data.filter(function(d){
		if("All" == document.getElementById("TypeSelector").value) {return true}
		else if(d["Type1"] != document.getElementById("TypeSelector").value && d["Type2"] != document.getElementById("TypeSelector").value) {return false}
		return true;
	});
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d[document.getElementById("XAxis").value] = +d[document.getElementById("XAxis").value];
    d[document.getElementById("YAxis").value] = +d[document.getElementById("YAxis").value];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(document.getElementById("XAxis").value);

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(document.getElementById("YAxis").value);

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) {
		if (d["Type1"] == "Fire") {
			return "#FF0000";
		}
		else if (d["Type1"] == "Ice") {
			return "#00FFFF";
		}
		else if (d["Type1"] == "Water") {
			return "#0000FF";
		}
		else if (d["Type1"] == "Grass") {
			return "#00FF00";
		}
		else if (d["Type1"] == "Poison") {
			return "#8B008B";
		}
		else if (d["Type1"] == "Ground") {
			return "#DAA520";
		}
		else if (d["Type1"] == "Steel") {
			return "#C0C0C0";
		}
		else if (d["Type1"] == "Psychic") {
			return "#FF1493";
		}
		else if (d["Type1"] == "Rock") {
			return "#8B4513";
		}
		else if (d["Type1"] == "Fighting") {
			return "#8B0000";
		}
		else if (d["Type1"] == "Flying") {
			return "#9370DB";
		}
		else if (d["Type1"] == "Normal") {
			return "#FFE4C4";
		}
		else if (d["Type1"] == "Bug") {
			return "#9ACD32";
		}
		else if (d["Type1"] == "Electric") {
			return "#FFFF00";
		}
		else if (d["Type1"] == "Ghost") {
			return "#483D8B";
		}
		else if (d["Type1"] == "Dark") {
			return "#2F2F2F";
		}
		else if (d["Type1"] == "Fairy") {
			return "#FFC0CB";
		}
		else if (d["Type1"] == "Dragon") {
			return "#6400E6";
		}
		})
	  .style("opacity", .75)
      .on("mouseover", function(d) {

          // show the tool tip
          tooltip.transition()
               .duration(200)
               .style("opacity", .75);

          // fill to the tool tip with the appropriate data
          tooltip.html("<strong>" + d["Name"] + "</strong><br/>"+document.getElementById("XAxis").value+ " " + xValue(d)
          + "<br/>" + document.getElementById("YAxis").value + " " + yValue(d) + "<br/>" + document.getElementById("dotSize").value + " " + sizeForCircle(d))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");




          

      })
      .on("mouseout", function(d) {
          // hide the tooltip
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
	  .on("click", function(d) {
		infobox.transition()
			.transition(200)
			.style("opacity", 100);
		infobox.html("<strong>" + d["Name"] + "</strong><br/>Type 1: " + d["Type1"] + " Type 2: "+ d["Type2"] +"<br/>Health: " + d["Health"]
          + "<br/>Attack: " + d["Attack"] + "<br/>Defense: " + d["Defense"] + 
		  "<br/>Sp. Attack: " + d["Sp. Attack"] + "<br/>Sp. Defense: " + d["Sp. Defense"]
		  + "<br/>Speed: " + d["Speed"])
			.style("right", 100+"px")
			.style("top", 150+"px");
	  })
	d3.select("body")
		.append("p1")
		.append("button")
		.on("click", filterType)
		.text("Update Data")
	d3.select("body")
		.append("p2")
	d3.select("body")
		.append("p3")
	d3.select("body")
		.append("p4")
	})
	function filterType() {
	svg.selectAll(".dot")
	.filter(function(d) { return d["Type1"] != document.getElementById("TypeSelector").value 
		&& d["Type2"] != document.getElementById("TypeSelector").value})
	.transition()
	.duration(200)
	.delay(200)
	.style("opacity", 0)
	svg.selectAll(".dot")
	.filter(function(d) { return d["Type1"] == document.getElementById("TypeSelector").value
		|| d["Type2"] == document.getElementById("TypeSelector").value})
	.transition()
	.duration(200)
	.delay(200)
	.style("opacity", 0.75)
	svg.selectAll(".dot")
	.filter(function(d) { return "All" == document.getElementById("TypeSelector").value})
	.transition()
	.duration(200)
	.delay(200)
	.style("opacity", 0.75)
	updateData();
	}

	function updateData() {
	svg.selectAll(".dot").remove();
	svg.selectAll("g").remove();
	d3.csv("pokemon_stats.csv", function(error, data) {
	data = data.filter(function(d){
		if("All" == document.getElementById("TypeSelector").value) {return true}
		else if(d["Type1"] != document.getElementById("TypeSelector").value && d["Type2"] != document.getElementById("TypeSelector").value) {return false}
		return true;
	});
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d[document.getElementById("XAxis").value] = +d[document.getElementById("XAxis").value];
    d[document.getElementById("YAxis").value] = +d[document.getElementById("YAxis").value];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(document.getElementById("XAxis").value);

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(document.getElementById("YAxis").value);

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) {
		if (d["Type1"] == "Fire") {
			return "#FF0000";
		}
		else if (d["Type1"] == "Ice") {
			return "#00FFFF";
		}
		else if (d["Type1"] == "Water") {
			return "#0000FF";
		}
		else if (d["Type1"] == "Grass") {
			return "#00FF00";
		}
		else if (d["Type1"] == "Poison") {
			return "#8B008B";
		}
		else if (d["Type1"] == "Ground") {
			return "#DAA520";
		}
		else if (d["Type1"] == "Steel") {
			return "#C0C0C0";
		}
		else if (d["Type1"] == "Psychic") {
			return "#FF1493";
		}
		else if (d["Type1"] == "Rock") {
			return "#8B4513";
		}
		else if (d["Type1"] == "Fighting") {
			return "#8B0000";
		}
		else if (d["Type1"] == "Flying") {
			return "#9370DB";
		}
		else if (d["Type1"] == "Normal") {
			return "#FFE4C4";
		}
		else if (d["Type1"] == "Bug") {
			return "#9ACD32";
		}
		else if (d["Type1"] == "Electric") {
			return "#FFFF00";
		}
		else if (d["Type1"] == "Ghost") {
			return "#483D8B";
		}
		else if (d["Type1"] == "Dark") {
			return "#2F2F2F";
		}
		else if (d["Type1"] == "Fairy") {
			return "#FFC0CB";
		}
		else if (d["Type1"] == "Dragon") {
			return "#6400E6";
		}
		})
	  .style("opacity", .75)
      .on("mouseover", function(d) {

          // show the tool tip
          tooltip.transition()
               .duration(200)
               .style("opacity", .75);

          // fill to the tool tip with the appropriate data
          tooltip.html("<strong>" + d["Name"] + "</strong><br/>"+document.getElementById("XAxis").value+ " " + xValue(d)
          + "<br/>" + document.getElementById("YAxis").value + " " + yValue(d))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");




          

      })
      .on("mouseout", function(d) {
          // hide the tooltip
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
	  .on("click", function(d) {
		infobox.transition()
			.transition(200)
			.style("opacity", 100);
		infobox.html("<strong>" + d["Name"] + "</strong><br/>Type 1: " + d["Type1"] + " Type 2: "+ d["Type2"] +"<br/>Health: " + d["Health"]
          + "<br/>Attack: " + d["Attack"] + "<br/>Defense: " + d["Defense"] + 
		  "<br/>Sp. Attack: " + d["Sp. Attack"] + "<br/>Sp. Defense: " + d["Sp. Defense"]
		  + "<br/>Speed: " + d["Speed"])
			.style("right", 100+"px")
			.style("top", 100+"px");
	  })
	  })
	  }

;




