var timelinewidth = document.getElementById("timelineModule").offsetWidth - 30;
var height = 300;
var margin = 20;
var evoKeyWidth = 160;

var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
var pokeID = pokemon.Number;
pokeID = trimID(pokeID);
var nameData, moveData, pokeMoveData, speciesData, evolutionData, triggerData, types, contestTypes;

function trimID(id) {
    while (id.charAt(0) == 0){
        id = id.substr(1, id.length - 1);
    }
    while (isLetter(id.charAt(id.length - 1))) {
        id = id.substr(0, id.length - 1);
    }
    return id;
}

function isLetter(char) {
    return (char.match(/[a-z]/i));
}
var xScale = d3.scale.linear()
    .domain([0, 100])
    .range([evoKeyWidth, timelinewidth - margin]);
var xMap = function(d) { return xScale(d);} // data -> display
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yScale = d3.scale.ordinal()
    .domain([0, 3])
    .range([margin, height - margin]);
    
var svg = d3.select("#timelineModule").append("svg")
    .attr("width", timelinewidth)
    .attr("height", height)
    .append("g");

svg.append("g")
    .attr("class", "axis")
    .call(xAxis)
    .attr("transform", "translate(0," + (height - 2 * margin) + ")");


//loads in data about all moves
d3.csv("/assets/data/moves.csv", function(data) {
    moveData = data;
});

//loads in data about pokémon's evolutions
d3.csv("/assets/data/pokemon_evolution.csv", function(data) {
    evolutionData = data;
});

//loads in data about evolution triggers
d3.csv("/assets/data/evolution_triggers.csv", function(data) {
    triggerData = data;
});

//loads in data about types
d3.csv("/assets/data/types.csv", function(data) {
    types = data;
});

d3.csv("/assets/data/contest_types.csv", function(data) {
    contestTypes = data;
});

var chain, evolutions;

//loads in data about pokémon's evolution chains
d3.csv("/assets/data/pokemon_species.csv", function(data) {
    speciesData = data;
    
    //gets all of the pokemon in the chain
    chain = orderIDSBasedOnChain(getAllPokemonInChain(pokeID));
    
    evolutions = getEvolutions(pokeID);
    
    for (var i = 0; i < chain.length; i++) {
        //draw rectangle indicating current Pokemon
                if (chain[i] == pokeID) {                      
                    svg.append("rect")
                        .attr("class", "current-timeline-pokemon")
                        .attr("cx", 0)
                        .attr("y", (height - margin) / chain.length * i + (.25 * ((height - margin) / chain.length)))
                        .attr("width", timelinewidth)
                        .attr("height", (height - margin) / chain.length - 50);
                }
    }

    for (var i = 0; i < evolutions.length; i++) {
        for (var j = 0; j < chain.length; j++) {
                
            if (evolutions[i].evolved_species_id == chain[j]) {
                var x = xMap(evolutions[i].minimum_level);
                var y = (height - margin) / chain.length * (j - 1) + (.5 * ((height - margin) / chain.length));
                
                svg.append("polygon")
                    .attr("class", "timeline-evo " + "evo-" + i)
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("i", i)
                    .attr("points", CalculateStarPoints(x, y, 5, 20, 10))
                    .on("mouseover", function() {drawEvoTooltip(evolutions[this.getAttribute("i")]);})
                    .on("mouseout", function() {hidetooltip();})
                    .on("click", function() {viewPokemon(getPokemonStats(evolutions[this.getAttribute("i")].evolved_species_id));});
            }
        }
    }
    
    //appends the names to the left
    //loads in data about pokemon names
    d3.csv("/assets/data/pokemon_stats.csv", function(data) {
        nameData = data;
        for (var i = 0; i < chain.length; i++) {
        svg.append("text")
            .attr("class", "timeline-text")
            .attr("x", 0)
            .attr("y", (height - margin) / chain.length * i + (.5 * ((height - margin) / chain.length)))
            .text(getPokemonStats(chain[i]).Name);
        }
    });
    
    
    //loads in data about individual pokémon's moves
    d3.csv("/assets/data/pokemon_moves.csv", function(data) {
        pokeMoveData = data;
        
        
        for (var i = 0; i < chain.length; i++) {
        var moves = getPokeMoves(chain[i]);
        
            for (var j = 0; j < moves.length; j++) {
                
                var move = moves[j];
                var moveinfo = getMoveData(move.move_id);
                var type = getType(moveinfo.type_id);
                var level = move.level;
                //draws a circle at the level and evolutionary stage of the pokemon
                svg.append("circle")
                    .attr("class", "timeline-move")
                    .attr("i", i)
                    .attr("j", j)
                    .attr("cx", xMap(level))
                    .attr("cy", (height - margin) / chain.length * i + (.5 * ((height - margin) / chain.length)))
                    .attr("fill", getTypeColor(type))
                    .on("mouseover", function() {
                        var moves = getPokeMoves(chain[this.getAttribute('i')]);
                        var move = moves[this.getAttribute('j')];
                        var moveinfo = getMoveData(move.move_id);
                        var type = getType(moveinfo.type_id);
                        var level = move.level;
                        drawMoveTooltip(moveinfo, moveinfo.identifier, type, level);})
                   .on("mouseout", function() {hidetooltip();});
            }
        }
    });
});

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function drawEvoTooltip(evolution) {
    // show the tool tip
    tooltip.transition()
        .duration(250)
        .style("opacity", 1);
     var pokemonStats = getPokemonStats(evolution.evolved_species_id);
     var typeLine;
     if (pokemonStats["Type2"] != "none") {
         typeLine = "<span style='display:inline;'><p>Type: " + pokemonStats["Type1"] + " / " + pokemonStats["Type2"] + "</p></span>";
     } else {
         typeLine = "<span style='display:inline;'><p>Type: " + pokemonStats["Type1"] + "</p></span>";
     }
     var levelText;
        if (evolution.minimum_level != "") {
            levelText = "<h2> At level " + evolution.minimum_level + "</h2>";
        } else if (getEvolutionTrigger(evolution.evolution_trigger_id) == "level-up") {
            levelText = "<h2> When level-up conditions are met </h2>";
        } else if (getEvolutionTrigger(evolution.evolution_trigger_id) == "use-item") {
            levelText = "<h2> When an item is used </h2>";
        } else if (getEvolutionTrigger(evolution.evolution_trigger_id) == "trade") {
            levelText = "<h2> When traded </h2>";
        } else if (getEvolutionTrigger(evolution.evolution_trigger_id) == "shed") {
            levelText = "<h2> When shed conditions are met </h2>";
        }
     tooltip.html(
        "<div><h1> Evolves into " + pokemonStats.Name + "</h1>" +
            levelText +
            "<span><img class='pokeImg' src='" + pokemonStats.Image + "'></span>" +
            typeLine
    ).style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
}

function hidetooltip() {
     // hide the tool tip
    tooltip.transition()
        .duration(250)
        .style("opacity", 0);
}

function drawMoveTooltip(movedata, movename, movetype, movelevel) {
    // show the tool tip
    tooltip.transition()
        .duration(250)
        .style("opacity", 1);
     tooltip.html(
        "<div><h1> Learns " + movename + "</h1>" +
            "<h2> At level " + movelevel + "</h2>" +
            "<span style='display:inline;'><p>Type: " + movetype + "</p></span>"
    ).style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
 } 

//code to draw star in svg borrowed from github gist https://gist.github.com/Dillie-O/4548290#file-gistfile1-js
function CalculateStarPoints(x, y, arms, outer, inner) {
     var results = "";

     var angle = Math.PI / arms;

    for (var i = 0; i < 2 * arms; i++)
    {
        // Use outer or inner radius depending on what iteration we are in.
        var r = (i & 1) == 0 ? outer: inner;
        
        var currX = x + Math.cos(i * angle) * r;
        var currY = y + Math.sin(i * angle) * r;
    
        // Our first time we simply append the coordinates, subsequet times
        // we append a ", " to distinguish each coordinate pair.
        if (i == 0)
        {
            results = currX + "," + currY;
        }
        else
        {
            results += ", " + currX + "," + currY;
        }
    }
    
    return results;
}
//returns the moveset of a pokémon based on its numerical id
function getPokeMoves(id) {
     var pokeMoves = new Array();

    for(var i = 0; i < pokeMoveData.length; i++){
       if (pokeMoveData[i].pokemon_id == id && pokeMoveData[i].version_group_id == 16 && pokeMoveData[i].level != 0) {
           pokeMoves.push(pokeMoveData[i]);
       } 
   }

    return pokeMoves;
}

//returns the typename based on its numerical id
function getType(id) {
    for (var i = 0; i < types.length; i++) {
        if (id == types[i].id) {
            return types[i].identifier;
        }
    }
}

function getContestType(id) {
    for (var i = 0; i < contestTypes.length; i++) {
        if (id == contestTypes[i].id) {
            return contestTypes[i].identifier;
        }
    }
}

//returns the evolution chain of a pokémon based on its numerical id
function getEvolutions(id) {

    var evolutionIDs = getAllPokemonInChain(id);
    
    var evolutions = new Array();
    
    for (var i = 0; i < evolutionData.length; i++) {
        for (var j = 0; j < evolutionIDs.length; j++) {
            if (evolutionData[i].evolved_species_id == evolutionIDs[j]) {
                evolutions.push(evolutionData[i]);
            }
        }
    }
    
    return evolutions;
    
}

//returns the evolution trigger text based on the trigger id
function getEvolutionTrigger(id) {
    for (var i = 0; i < triggerData.length; i++) {
        if (triggerData[i].id == id) {
            return triggerData[i].identifier;
        }
    }
}

function getAllPokemonInChain(id){
     var speciesID;
    
    for (var i = 0; i < speciesData.length; i++) {
        if (speciesData[i].id == id) {
            speciesID = speciesData[i].evolution_chain_id;
        }
    }
    
    var evolutionIDs = new Array();
    
    for (var i = 0; i < speciesData.length; i++) {
        if (speciesData[i].evolution_chain_id == speciesID) {
           evolutionIDs.push(speciesData[i].id);
            
        }
    }
    
    return evolutionIDs;
    
}

//returns the information about a move based on its numerical id
function getMoveData(id) {
    var move;
    for (var i = 0; i < moveData.length; i++) {
        if (moveData[i].id == id) {
            move = moveData[i];
        }
    }
    return move;
    
}


//returns the pokemon's stats based on its numerical id
function getPokemonStats(id) {
    for (var i = 0; i < nameData.length; i++) {
        if (nameData[i].Number == id) {
           return nameData[i];
        }
    }
}

function orderIDSBasedOnChain(ids) {
    var expectedPrev = "";
    for (var i = 0; i < ids.length; i++) {       
        var prevPokemon;
        for (var j = 0; j < speciesData.length; j++) {
            if (ids[i] == speciesData[j].id) {
                prevPokemon = speciesData[j].evolves_from_species_id;
            }
        }      
        if (prevPokemon != expectedPrev) {
            for (var k = 0; k < ids.length; k++) {
                if (ids[k] == prevPokemon) {
                    ids.splice(k, 1);
                }
            }
            ids.splice(i, 0, prevPokemon);
            expectedPrev = prevPokemon;
        } else {
            expectedPrev = ids[i];
        }
    }
    return ids;
}

function viewPokemon(d) {
        localStorage.setItem("storageJSON", JSON.stringify(d));
        console.log(JSON.parse(localStorage.getItem("storageJSON")));
        location.href = 'pokemonPage.html';
}

