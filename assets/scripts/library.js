function drawBars(data) {

  /**
   * Play with the D3 filter method and understand how it works.
   *
   **/
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.number); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.gpa); })
      .attr("height", function(d) { return height - y(d.gpa); });
}

function drawXAxis(){
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
}

function drawYAxis() {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("GPA");
}

/**
 * Create a preprocessing filter method to remove data for
 * the letter B from the data set
 *
 **/
function isTypeSelected(datum) {
  // console.log("Is course " + datum.department + " " + datum.number + " in department " + dept + "?");
  // console.log(datum.department != dept);
  return true;
}

function filterType() {
    console.log("Showing Only Department " + dept);
    svg.selectAll(".bar")
        .style("fill","steelblue")
        .filter(function(d) { return isTypeSelected(d); })
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.Gen; })
        .style("opacity","0");

}

/**
 * Supporting the onclick event, write a function that can filter data
 * using the already bound DOM elements, and change the bar's height back
 * to zero.
 *
 **/
function filterBars() {
  svg.selectAll(".bar")
//      .filter(function(d) { return isDepartment(d, ); })
      .transition()
      .duration(function(d) { return Math.random() * 1000; } )
      .delay(function(d) { return d.frequency * 8000; })
      .style("fill","red")
      .attr("y", function(d) { return (y(d.frequency/2)); })
      .attr("height", function(d) { return (height - y(d.frequency))/2; });
}

function getTypeColor(d) {
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
}

function renderPokemonInfo() {
    //console.log("Rendering Pokemon Info");
    var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
    //console.log(pokemon);
    document.getElementById("name").innerHTML= pokemon.Name;
    document.getElementById("type").innerHTML= "Type: " + pokemon.Type1;
    document.getElementById("generation").innerHTML= "Generation: " + pokemon.Gen;
    document.getElementById("picture").innerHTML= "<img src=" + pokemon.Image + " width='200px'>";

}
