var eggGroupData;
var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
var pokeGroups;
var comparingPokemon, pokeName, toolDiv, possibleMoves, pokeAbilities;


d3.csv("/assets/data/pokemon_egg_groups.csv", function(data){
   eggGroupData = data;
    pokeName = pokemon.Name.toLowerCase();
    pokeName = pokeName.split(" (")[0];
    pokeGroups = getEggGroup(pokeName);
    // render the table
    var table = d3.select("#breedingModule").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");
    table.attr("class", "table");
    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data([pokemon.Name + "'s Egg Groups", comparingPokemon])
        .enter()
        .append("th")
            .text(function(column) { return column; })
            .attr("class", "eggHeader");

    // create a row for each object in the data
    var newRows = new Array();
    newRows.push("");
    newRows.push("");
    var rows = tbody.selectAll("tr")
        .data(newRows)
        .enter()
        .append("tr")


    toolDiv = d3.select("body").append("div")
    .attr("class", "pokeTooltip");

    possibleMoves = document.getElementById('possible_moves');

    // create a cell in each row for each column
    var newCells = new Array();
    newCells.push("");
    newCells.push("");

    var cells = rows.selectAll("td")
        .data(newCells)
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(newCells[0]);

    var tableRows = d3.select("#breedingModule").select("table")[0][0].rows;
    for(var i = 1; i < tableRows.length; i++){
        var tempCells = tableRows[i].getElementsByTagName("td");

        if(typeof pokeGroups[i - 1] != 'undefined') tempCells[0].innerHTML = pokeGroups[i - 1];
        else tempCells[0].innerHTML = "";

    }

});

function testing(pokeA, pokeB){
    document.getElementById('eggGroupPokemon').value = pokeA;
    showPossibleAbilitites(pokeA, pokeB);
    updateEggs();

}

function showPossibleAbilitites(pokeA, pokeB){
    var abilities = new Array();
    for(var i = 0; i < eggGroupData.length; i++){
       if(eggGroupData[i].species_ability == pokeA) abilities.push(eggGroupData[i].ability);
       if(eggGroupData[i].species_ability == pokeB) abilities.push(eggGroupData[i].ability);
    }
    var abilitiesStr = new Array("<li class='list-group-item'><strong>Possible Abilities: </strong><br>");
    for(var j = 0; j < abilities.length; j++){
        abilitiesStr += abilities[j] + "<br>";
    }
    abilitiesStr += "</li>";
    return abilitiesStr;
}


function getEggGroup(pokemon){
    var pokeGroups = new Array();

    for(var i = 0; i < eggGroupData.length; i++){
       if(eggGroupData[i].species == pokemon) pokeGroups.push(eggGroupData[i].egg_group);
   }

    return pokeGroups;
}

function updateEggs(){
    comparingPokemon = document.getElementById("eggGroupPokemon").value.toLowerCase();

    var table = d3.select("#breedingModule").select("table")[0][0],
            thead = table.tHead,
            tbody = table.tBody;

    var rows = table.rows;

    var groups = getEggGroup(comparingPokemon);

    rows[0].getElementsByTagName("th")[1].innerHTML = document.getElementById("eggGroupPokemon").value + "'s Egg Groups'";

    for(var i = 1; i < rows.length; i++){
        var tempCells = rows[i].getElementsByTagName("td");
        if(typeof groups[i - 1] != 'undefined') tempCells[1].innerHTML = groups[i - 1];
        else tempCells[1].innerHTML = "";
    }

    var row1 = breedingOutcome(pokeName, comparingPokemon);
    if (row1 == "<li class='list-group-item list-group-item-success'>These two Pokemon CAN breed.</li>") {
        var row2 = showPossibleAbilitites(pokeName, comparingPokemon);
        possibleMoves.innerHTML = row1 + row2;
    } else {
        possibleMoves.innerHTML = row1;
    }
}

function breedingOutcome(pokeA, pokeB){
    var pokeAEggGroup = getEggGroup(pokeA);
    var pokeBEggGroup = getEggGroup(pokeB);
    var breedingModuleText = document.getElementById("canBreedText");

    for(var i = 0; i < pokeAEggGroup.length; i++){
        for(var j = 0; j < pokeBEggGroup.length; j++){
            if(pokeAEggGroup[i] == pokeBEggGroup[j]){
                return "<li class='list-group-item list-group-item-success'>These two Pokemon CAN breed.</li>";
            }
            return "<li class='list-group-item list-group-item-danger'>These two Pokemon CANNOT breed.</li>";
        }
    }
}

function allInEggGroup(type){
    var allInGrp = new Array();

    for(var i = 0; i < eggGroupData.length; i++){
        if(eggGroupData[i].egg_group == type) allInGrp.push(eggGroupData[i].species);
    }

    return allInGrp;
}
