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

function getTypeColor(type) {
    type = type.toUpperCase();
    if (type == "FIRE") {
        return "#FF0000";
    }
    else if (type == "ICE") {
        return "#00FFFF";
    }
    else if (type == "WATER") {
        return "#0000FF";
    }
    else if (type == "GRASS") {
        return "#00FF00";
    }
    else if (type == "POISON") {
        return "#8B008B";
    }
    else if (type == "GROUND") {
        return "#DAA520";
    }
    else if (type == "STEEL") {
        return "#C0C0C0";
    }
    else if (type == "PSYCHIC") {
        return "#FF1493";
    }
    else if (type == "ROCK") {
        return "#8B4513";
    }
    else if (type == "FIGHTING") {
        return "#8B0000";
    }
    else if (type == "FLYING") {
        return "#9370DB";
    }
    else if (type == "NORMAL") {
        return "#FFE4C4";
    }
    else if (type == "BUG") {
        return "#9ACD32";
    }
    else if (type == "ELECTRIC") {
        return "#FFFF00";
    }
    else if (type == "GHOST") {
        return "#483D8B";
    }
    else if (type == "DARK") {
        return "#2F2F2F";
    }
    else if (type == "FAIRY") {
        return "#FFC0CB";
    }
    else if (type == "DRAGON") {
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

function showNone() {
    console.log("Show no types");
    document.getElementById("all").className = "key general inactive";
    document.getElementById("none").className = "key general";
    document.getElementById("Bug").className = "key bug inactive";
    document.getElementById("Dark").className = "key dark inactive";
    document.getElementById("Dragon").className = "key dragon inactive";
    document.getElementById("Electric").className = "key electric inactive";
    document.getElementById("Fighting").className = "key fighting inactive";
    document.getElementById("Fire").className = "key fire inactive";
    document.getElementById("Flying").className = "key flying inactive";
    document.getElementById("Ghost").className = "key ghost inactive";
    document.getElementById("Grass").className = "key grass inactive";
    document.getElementById("Ground").className = "key ground inactive";
    document.getElementById("Ice").className = "key ice inactive";
    document.getElementById("Normal").className = "key normal inactive";
    document.getElementById("Poison").className = "key poison inactive";
    document.getElementById("Psychic").className = "key psychic inactive";
    document.getElementById("Rock").className = "key rock inactive";
    document.getElementById("Steel").className = "key steel inactive";
    document.getElementById("Water").className = "key water inactive";
    // for (var t in hiddenTypes) {
    //     hiddenTypes[t].hidden = true;
    // }
    // console.log(hiddenTypes);
    hideAllDots();
}

function showAll() {
    console.log("Show all types");
    document.getElementById("all").className = "key general";
    document.getElementById("none").className = "key general inactive";
    document.getElementById("Bug").className = "key bug";
    document.getElementById("Dark").className = "key dark";
    document.getElementById("Dragon").className = "key dragon";
    document.getElementById("Electric").className = "key electric";
    document.getElementById("Fighting").className = "key fighting";
    document.getElementById("Fire").className = "key fire";
    document.getElementById("Flying").className = "key flying";
    document.getElementById("Ghost").className = "key ghost";
    document.getElementById("Grass").className = "key grass";
    document.getElementById("Ground").className = "key ground";
    document.getElementById("Ice").className = "key ice";
    document.getElementById("Normal").className = "key normal";
    document.getElementById("Poison").className = "key poison";
    document.getElementById("Psychic").className = "key psychic";
    document.getElementById("Rock").className = "key rock";
    document.getElementById("Steel").className = "key steel";
    document.getElementById("Water").className = "key water";
    // for (var t in hiddenTypes) {
    //     hiddenTypes[t].hidden = false;
    // }
    //console.log(hiddenTypes);
    showAllDots();
}

function toggleType(html) {
    //console.log(html.id);
    document.getElementById("all").className = "key general inactive";
    document.getElementById("none").className = "key general inactive";
    var element = document.getElementById(html.id);
    var classes = element.className.split(" ");
    //console.log(classes);
    var newClass = "";
    var active = true;
    for (var c in classes) {
        if (classes[c] == "inactive") {
            active = false;
        } else {
            newClass += classes[c] + " ";
        }
    }
    if (active) {
        newClass += "inactive";
        hideType(html.id);
    } else{
        showType(html.id);
    }
    element.className = newClass;
    //console.log(element.className);
}
