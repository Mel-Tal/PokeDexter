var width = document.getElementById("timelineModule").offsetWidth - 30;
var height = 300;
var margin = 20;
var evoKeyWidth = 160;
    
var pokeID = pokemon.Number;
var nameData, moveData, pokeMoveData, speciesData, evolutionData, triggerData, types;

var xScale = d3.scale.linear()
    .domain([0, 100])
    .range([evoKeyWidth, width - margin]);
var xMap = function(d) { return xScale(d);} // data -> display
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yScale = d3.scale.ordinal()
    .domain([0, 3])
    .range([margin, height - margin]);
    
var svg = d3.select("#timelineModule").append("svg")
    .attr("width", width)
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

//loads in data about pokémon's evolution chains
d3.csv("/assets/data/pokemon_species.csv", function(data) {
    speciesData = data;
    
    //gets all of the pokemon in the chain
    var chain = orderIDSBasedOnChain(getAllPokemonInChain(pokeID));
    
    var evolutions = getEvolutions(pokeID);
    
    for (var i = 0; i < chain.length; i++) {
        //draw rectangle indicating current Pokemon
                if (chain[i] == pokeID) {                      
                    svg.append("rect")
                        .attr("class", "current-timeline-pokemon")
                        .attr("cx", 0)
                        .attr("y", (height - margin) / chain.length * i + (.25 * ((height - margin) / chain.length)))
                        .attr("width", width)
                        .attr("height", (height - margin) / chain.length - 50);
                }
    }

    for (var i = 0; i < evolutions.length; i++) {
        for (var j = 0; j < chain.length; j++) {
                
            if (evolutions[i].evolved_species_id == chain[j]) {
                var x = xMap(evolutions[i].minimum_level);
                var y = (height - margin) / chain.length * (j - 1) + (.5 * ((height - margin) / chain.length));
                
                var evolution = evolutions[i];
                svg.append("polygon")
                    .attr("class", "timeline-evo " + "evo-" + i)
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("points", CalculateStarPoints(x, y, 5, 20, 10));

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
            
        svg.selectAll(".evo-0")   
            .on("mouseover", function() {drawEvoTooltip(evolutions[0]);})
            .on("mouseout", function() {hideEvoTooltip(evolutions[0]);})
            .on("click", function() {viewPokemon(getPokemonStats(evolutions[0].evolved_species_id));});
            
        svg.selectAll(".evo-1")   
            .on("mouseover", function() {drawEvoTooltip(evolutions[1]);})
            .on("mouseout", function() {hideEvoTooltip(evolutions[1]);})
            .on("click", function() {viewPokemon(getPokemonStats(evolutions[1].evolved_species_id));});
     }
    
    
    //loads in data about individual pokémon's moves
    d3.csv("/assets/data/pokemon_moves.csv", function(data) {
        pokeMoveData = data;
        
        
        for (var i = 0; i < chain.length; i++) {
        var moves = getPokeMoves(chain[i]);
        
            for (var j = 0; j < moves.length; j++) {
                
                //draws a circle at the level and evolutionary stage of the pokemon
                svg.append("circle")
                    .attr("class", "timeline-move")
                    .attr("cx", xMap(moves[j].level))
                    .attr("cy", (height - margin) / chain.length * i + (.5 * ((height - margin) / chain.length)))
                    .attr("fill", getTypeColor(getType(getMoveData(moves[j].move_id).type_id)));
            }
    }});
    
    });
});

// add the tooltip area to the webpage
var evotooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function drawEvoTooltip(evolution) {
    // show the tool tip
    evotooltip.transition()
        .duration(250)
        .style("opacity", 1);
     var pokemonStats = getPokemonStats(evolution.evolved_species_id);
     if (pokemonStats["Type2"] != "none") {
     evotooltip.html(
        "<div><h1> Evolves into " + pokemonStats.Name + "</h1>" +
            "<h2> At level " + evolution.minimum_level + "</h2>" +
            "<span><img class='pokeImg' src='" + pokemonStats.Image + "'></span>" +
            "<span style='display:inline;'><p>Type: " + pokemonStats["Type1"] + " / " + pokemonStats["Type2"] + "</p></span>"
    ).style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
     } else {
         evotooltip.html(
        "<div><h1> Evolves into " + pokemonStats.Name + "</h1>" +
            "<h2> At level " + evolution.minimum_level + "</h2>" +
            "<span><img class='pokeImg' src='" + pokemonStats.Image + "'></span>" +
            "<span style='display:inline;'><p>Type: " + pokemonStats["Type1"] + "</p></span>"
    ).style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
     }
}

function hideEvoTooltip(evolution) {
     // hide the tool tip
    evotooltip.transition()
        .duration(250)
        .style("opacity", 0);
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