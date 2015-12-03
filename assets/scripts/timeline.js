var margin = {top: 20, right: 300, bottom: 20, left: 30};
var width = document.getElementById("timelineModule").offsetWidth;
var height = 300;


var svg = d3.select("#timelineModule").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var pokeID = pokemon.Number;
var moveData, pokeMoveData, evolutionData;

//loads in data about all moves
d3.csv("/assets/data/moves.csv", function(data) {
    moveData = data;
});

//loads in data about individual pokémon's moves
d3.csv("/assets/data/pokemon_moves.csv", function(data) {
    pokeMoveData = data;
    var moves = getPokeMoves(pokeID);
    for (var i = 0; i < moves.length; i++) {
        console.log(getMoveData(moves[i].move_id).identifier, moves[i].level);
    }
});

//loads in data about pokémon's evolution chains
d3.csv("/assets/data/pokemon_evolution.csv", function(data) {
    evolutionData = data;
});


//returns the moveset of a pokémon based on its numerical id
function getPokeMoves(id) {
     var pokeMoves = new Array();

    for(var i = 0; i < pokeMoveData.length; i++){
       if (pokeMoveData[i].pokemon_id == pokeID && pokeMoveData[i].version_group_id == 16 && pokeMoveData[i].level != 0) {
           pokeMoves.push(pokeMoveData[i]);
       } 
   }

    return pokeMoves;
}

//returns the evolution chain of a pokémon based on its numerical id
function getEvolutions(id) {
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