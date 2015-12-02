function barGraph() {
    console.log("Drawing bar graph");
    //Setting the size of our canvas
    var width = document.getElementById("bar_container").offsetWidth;
    var height = 290;

    console.log("h: " + height + ", w: " + width);
    //Creating our chart and grabbing attributes from ".chart" in header
    var svg = d3.select(".bar")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

    //Pulling data from JSON object
    var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
    console.log(pokemon);
    var data = [{"key": "HP", "value": pokemon.Health},
                {"key": "Attack", "value": pokemon.Attack},
                {"key": "Defense", "value": pokemon.Defense},
                //"key": "Sp Attack", "value": pokemon.Sp. Attack,
                //"key": "Sp Defense", "value": pokemon.Sp. Defense,
                {"key": "Speed", "value": pokemon.Speed}
            ];
    console.log(data);

    //Set our scale domains
    var x = d3.scale.ordinal().rangeRoundBands([0, width*.95], .1);
    var y = d3.scale.linear().range([height, 250]);

    x.domain(data.map(function(d) {return d.key; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    //Grabbing data and binding it to the bars
    var bars = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) {return "translate(" + x(d.key) + ", 0)";});

    //Logging data to the console so we can make sure the data is bound
    console.log(data);

    //Generating rectangle SVG elements for our data
    bars.append("rect")
        .attr("y", function(d) {return y(d.value);})
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());

    bars.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", height - 10)
        .text(function(d) {return d.key;});

    bars.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", function(d) {return y(d.value) - 10;})
        .text(function(d) {return d.value;});

    bars.append("title")
        .text(function(d) {return d.value - 10;});

}
