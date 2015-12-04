var margin = {top: 20, right: 300, bottom: 20, left: 30};
var width = document.getElementById("plot_container").offsetWidth;
var height = width*.6;

console.log(width);
console.log(height);

// pre-cursors
var sizeForCircle = function(d) {
    return Math.sqrt(0.8 * d[document.getElementById("dotSize").value]);
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
d3.csv("assets/data/pokemon_stats.csv", function(error, data) {
	data = data.filter(function(d){
		if("All" == document.getElementById("TypeSelector").value) {return true}
		else if(d["Type1"] != document.getElementById("TypeSelector").value && d["Type2"] != document.getElementById("TypeSelector").value) {return false}
		return true;
	});
    // change string (from CSV) into number format
    data.forEach(function(d) {
        d[document.getElementById("XAxis").value] = +d[document.getElementById("XAxis").value];
        d[document.getElementById("YAxis").value] = +d[document.getElementById("YAxis").value];
        //console.log(d);
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([0, d3.max(data, xValue)]);
    yScale.domain([0, d3.max(data, yValue)]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
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
            return getTypeColor(d);
        })
        .on("mouseover", function(d) {

            // show the tool tip
            tooltip.transition()
                .duration(250)
                .style("opacity", 1);

            if (d.Type2 != "none") {

            // fill to the tool tip with the appropriate data
            tooltip.html(
                "<div><h1>" + d["Name"] + "</h1>" +
                    "<span><img class='pokeImg' src='" + d["Image"] + "'></span>" +
                    "<span style='display:inline;'><p>Type: " + d["Type1"] + " / " + d["Type2"] +
                    "<br>Generation: " + d["Gen"] + "</span></p>" +
                    "<div id='radar'</div>"
            ).style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .append("radar");
            } else {
            tooltip.html(
                "<div><h1>" + d["Name"] + "</h1>" +
                    "<span><img class='pokeImg' src='" + d["Image"] + "'></span>" +
                    "<span style='display:inline;'><p>Type: " + d["Type1"] +
                    "<br>Generation: " + d["Gen"] + "</span></p>" +
                    "<div id='radar'</div>"
            ).style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .append("radar");

            }
            var radarD = [
                [
                    {axis:"HP",value:d["Health"]},
                    {axis:"Attack",value:d["Attack"]},
                    {axis:"Defense",value:d["Defense"]},
                    {axis:"Speed",value:d["Speed"]},
                    {axis:"Sp Attack",value:d["Sp. Attack"]},
                    {axis:"Sp Defense",value:d["Sp. Defense"]}
                ]];

                RadarChart.draw("#radar", radarD);
        })
        .on("mouseout", function(d) {
            // hide the tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
	    .on("click", function(d) {
            localStorage.setItem("storageJSON", JSON.stringify(d));
            console.log(JSON.parse(localStorage.getItem("storageJSON")));
            location.href = 'pokemonPage.html';
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

function isTypeHidden(datum) {
    console.log("Datum Types: 1-" + datum["Type1"] + " 2-" + datum["Type2"]);
  for (var t in hiddenTypes) {
      if ((hiddenTypes[t].type == datum["Type1"]) || (hiddenTypes[t].type == datum['Type2'])) {
          console.log("Datum is " + hiddenTypes[t].type);
          console.log("Datum hidden? " + hiddenTypes[t].hidden);
          return hiddenTypes[t].hidden;
      } else {
          console.log("Datum is not " + hiddenTypes[t].type);
      }

  }
  console.log("ERROR: Type not found");
  return false;
}

function showAllDots() {
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .style("opacity","1")
}

function hideAllDots() {
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .style("opacity","0")
}

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
	d3.csv("assets/data/pokemon_stats.csv", function(error, data) {
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
  xScale.domain([0, d3.max(data, xValue)]);
  yScale.domain([0, d3.max(data, yValue)]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
	  .style("opacity", 1)
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
	  .style("opacity", 1)
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
          return getTypeColor(d);
      })
	  .style("opacity", 0)
      .on("mouseover", function(d) {

          // show the tool tip
          tooltip.transition()
               .duration(200)
               .style("opacity", .75);

          // fill to the tool tip with the appropriate data
          tooltip.html(
                "<div style='width:252px;padding:5px;'><h1>" + d["Name"] + "</h1>" +
                    "<span style='padding-left:22.5px'><img src='" + d["Image"] + "' height='75px' width='75px'></span>" +
                    "<span style='display:inline;'><p>Type: " + d["Type1"] + ", " + d["Type2"] +
                    "<br>Generation: " + d["Gen"] + "</span></p>" +
                    "<div id='radar'</div>"
            ).style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .append("radar")
            var radarD = [
                [
                    {axis:"HP",value:d["Health"]},
                    {axis:"Attack",value:d["Attack"]},
                    {axis:"Defense",value:d["Defense"]},
                    {axis:"Speed",value:d["Speed"]},
                    {axis:"Sp Attack",value:d["Sp. Attack"]},
                    {axis:"Sp Defense",value:d["Sp. Defense"]}
                ]];

                RadarChart.draw("#radar", radarD);
        })
        .on("mouseout", function(d) {
            // hide the tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
	    .on("click", function(d) {
            localStorage.setItem("storageJSON", JSON.stringify(d));
            console.log(JSON.parse(localStorage.getItem("storageJSON")));
            location.href = 'pokemonPage.html';
	    })
	  /*svg.selectAll("g")
	  .transition().duration(1000).style("opacity", 1);*/
	  svg.selectAll("circle")
	  .transition().duration(1000).style("opacity", .75);
	  })
}

;
