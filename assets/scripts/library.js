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
        return "#CC0100";
    }
    else if (type == "ICE") {
        return "#00C9AA";
    }
    else if (type == "WATER") {
        return "#2640C2";
    }
    else if (type == "GRASS") {
        return "#057D0A";
    }
    else if (type == "POISON") {
        return "#863D94";
    }
    else if (type == "GROUND") {
        return "#A18138";
    }
    else if (type == "STEEL") {
        return "#5B6B69";
    }
    else if (type == "PSYCHIC") {
        return "#C74F9C";
    }
    else if (type == "ROCK") {
        return "#5C442A";
    }
    else if (type == "FIGHTING") {
        return "#5C281E";
    }
    else if (type == "FLYING") {
        return "#647DB8";
    }
    else if (type == "NORMAL") {
        return "#BDB196";
    }
    else if (type == "BUG") {
        return "#4E8513";
    }
    else if (type == "ELECTRIC") {
        return "#E5CB45";
    }
    else if (type == "GHOST") {
        return "#30226E";
    }
    else if (type == "DARK") {
        return "#2F2F2F";
    }
    else if (type == "FAIRY") {
        return "#FF7085";
    }
    else if (type == "DRAGON") {
        return "#138572";
    }
    
    //CONTEST TYPES
    else if (type == "COOL") {
        return "#CC0100";
        
    } 
    else if (type == "BEAUTY") {
        return "#2640C2";
    }
    else if (type == "SMART") {
        return "#057D0A";
    }
    else if (type == "CUTE") {
        return "#FF7085";
    }
    else if (type == "TOUGH") {
        return "#E5CB45";
    }
}



function renderPokemonInfo() {
    //console.log("Rendering Pokemon Info");
    var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
    //console.log(pokemon);
    var typeText;
    if (pokemon.Type2 != "none") {
        typeText = "Type: " + pokemon.Type1 + " / " + pokemon.Type2;
    } else {
        typeText = "Type: " + pokemon.Type1;
    }
    document.getElementById("name").innerHTML= pokemon.Name;
    document.getElementById("type").innerHTML= typeText ;
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
    document.getElementById("Fairy").className = "key fairy inactive";
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
    document.getElementById("Fairy").className = "key fairy";
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
