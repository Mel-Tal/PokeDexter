var eggGroupData;
var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
var pokeGroups;
var comparingPokemon, pokeName;

var div = d3.select("body").append("div")	
    .attr("class", "pokeTooltip");

d3.csv("/assets/data/pokemon_egg_groups.csv", function(data){
   eggGroupData = data;
    pokeName = pokemon.Name.toLowerCase();
    pokeGroups = getEggGroup(pokeName);
    // render the table
    var table = d3.select("#breedingModule").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data([pokeName, comparingPokemon])
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

    
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip");
    
    
    // create a cell in each row for each column
    var newCells = new Array();
   // for(var i = 0; i < 2; i++) test.push(pokeGroups[i]);
    newCells.push("");
    newCells.push("");
    var cells = rows.selectAll("td")
        .data(newCells)
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(newCells[0])
            .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(allInEggGroup(d));
                });
    var tableRows = d3.select("#breedingModule").select("table")[0][0].rows;
    for(var i = 1; i < tableRows.length; i++){
        var tempCells = tableRows[i].getElementsByTagName("td");
        console.log(pokeGroups[i - 1]);
        if(typeof pokeGroups[i - 1] != 'undefined') tempCells[0].innerHTML = pokeGroups[i - 1];
        else tempCells[0].innerHTML = "";
        
    }
    
});

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
    rows[0].getElementsByTagName("th")[1].innerHTML = comparingPokemon;
    for(var i = 1; i < rows.length; i++){
        var tempCells = rows[i].getElementsByTagName("td");
        if(typeof groups[i - 1] != 'undefined') tempCells[1].innerHTML = groups[i - 1];
        else tempCells[1].innerHTML = "";
    }
    breedingOutcome(pokeName, comparingPokemon);
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
    //part of same egg group?
    //not unown, Nidorina, Nidoqueen
    //different genders...need to check this...?
}

function allInEggGroup(type){
    var allInGrp = new Array();
    for(var i = 0; i < eggGroupData.length; i++){
        if(eggGroupData[i].egg_group == type) allInGrp.push(eggGroupData[i].species);
    }
    return allInGrp;
}

