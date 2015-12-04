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

    possibleMoves = d3.select("body").append("div").attr("class", "abilititesSection");

    // create a cell in each row for each column
    var newCells = new Array();
    newCells.push("");
    newCells.push("");

    var cells = rows.selectAll("td")
        .data(newCells)
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(newCells[0])
            .on("mouseover", function(d) {
                toolDiv.transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("position", "absolute")
                    .style("left", this.getBoundingClientRect().left + 350 + "px")
                    .style("top", this.getBoundingClientRect().top + "px");
                var innerText = this.innerHTML;
                toolDiv.html(function(d){
                    var eggGrps = allInEggGroup(innerText);
                    var eggGrpText = '';
                    for(var i = 0; i < eggGrps.length; i++){
                        var onclickStr = "testing('" + eggGrps[i] + "','" + pokeName + "');";
                        eggGrpText += ' <a href="#" onclick=' + onclickStr + '>' + eggGrps[i] + "</a>";
                    }
                    return eggGrpText;
                });
            });

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
    var abilitiesStr = new Array("Possible Abilities: <br>");
    for(var j = 0; j < abilities.length; j++){
        abilitiesStr += abilities[j] + "<br>";
    }
    possibleMoves.html(abilitiesStr);
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

    breedingOutcome(pokeName, comparingPokemon);
    showPossibleAbilitites(pokeName, comparingPokemon);
}

function breedingOutcome(pokeA, pokeB){
    var pokeAEggGroup = getEggGroup(pokeA);
    var pokeBEggGroup = getEggGroup(pokeB);
    var breedingModuleText = document.getElementById("canBreedText");

    for(var i = 0; i < pokeAEggGroup.length; i++){
        for(var j = 0; j < pokeBEggGroup.length; j++){
            if(pokeAEggGroup[i] == pokeBEggGroup[j]){
                breedingModuleText.innerHTML = "These two Pokemon CAN breed!"
                return;
            }
            breedingModuleText.innerHTML = "These two Pokemon CANNOT breed."
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
