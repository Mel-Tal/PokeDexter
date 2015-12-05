var margin = {top: 20, right: 300, bottom: 20, left: 30};
var width = document.getElementById("plot_container").offsetWidth;
var height = .75 * width;  

if (height > window.innerHeight - 100) {
    height = window.innerHeight - 150;
}

console.log(width);
console.log(height);

// pre-cursors
var sizeForCircle = function(d) {
    return Math.sqrt(0.8 * d[document.getElementById("dotSize").value]);
}

// setup x
var xValue = function(d) { return d[document.getElementById("XAxis").value];}, // data -> value
    xScale = d3.scale.linear().range([0, width]).domain([0,250]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d[document.getElementById("YAxis").value];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]).domain([0,250]), // value -> display
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



// load data
d3.csv("assets/data/pokemon_stats.csv", function(error, data) {
    // change string (from CSV) into number format
    data.forEach(function(d) {
        d[document.getElementById("XAxis").value] = +d[document.getElementById("XAxis").value];
        d[document.getElementById("YAxis").value] = +d[document.getElementById("YAxis").value];
        //console.log(d);
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    //xScale.domain([0, d3.max(data, xValue)]);
    //yScale.domain([0, d3.max(data, yValue)]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(5," + height + ")")
        .call(xAxis)
    .append("text")
        .attr("class", "label")
        .attr("id", "x label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(document.getElementById("XAxis").value);

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("fill", "white")
        .attr("transform", "translate(5, 0)")
        .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("id", "y label")
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
            return getTypeColor(d["Type1"]);
        })
        .on("mouseover", function(d) {drawTooltip(d);})
        .on("mouseout", function(d) {hideTooltip(d);})
	    .on("click", function(d) {viewPokemon(d)})


	d3.select("body")
		.append("p2")

    d3.select("body")
		.append("p3")

    d3.select("body")
		.append("p4")
})

function showAllDots() {
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .style("visibility", 'visible');
}

function hideAllDots() {
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .style("visibility", 'hidden');
}

function showType(t) {
    svg.selectAll(".dot")
        .filter(function(d) { return (d["Type1"] == t) || (d["Type2"] == t);})
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .style("visibility", 'visible');
}

function hideType(t) {
    svg.selectAll(".dot")
        .filter(function(d) { return (d["Type1"] == t) || (d["Type2"] == t);})
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .style("visibility", 'hidden');
}

function changeRadius(value) {
    console.log(value);
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .attr("r", function(d) {return Math.sqrt(0.8 * d[value]);})
}

function changeXAxis(value) {
    console.log(value);
    document.getElementById('x label').innerHTML = value;
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .attr("cx", function(d) {return xScale(d[value]);})
}

function changeYAxis(value) {
    console.log(value);
    document.getElementById('y label').innerHTML = value;
    svg.selectAll(".dot")
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen + 50; })
        .attr("cy", function(d) {return yScale(d[value]);})
}

function drawTooltip(d) {
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
}

function hideTooltip(d) {
    // hide the tooltip
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

function viewPokemon(d) {
        localStorage.setItem("storageJSON", JSON.stringify(d));
        console.log(JSON.parse(localStorage.getItem("storageJSON")));
        location.href = 'pokemonPage.html';
}

;
