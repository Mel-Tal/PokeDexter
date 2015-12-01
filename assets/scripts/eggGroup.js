var eggGroupData;
var pokemon = "bulbasaur";
var pokeGroups;
var comparingPokemon;

var div = d3.select("body").append("div")	
    .attr("class", "pokeTooltip");

d3.csv("/assets/data/pokemon_egg_groups.csv", function(data){
   eggGroupData = data;

    pokeGroups = getEggGroup(pokemon);
    // render the table
    var table = d3.select("#breedingModule").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data([pokemon, comparingPokemon])
        .enter()
        .append("th")
            .text(function(column) { return column; })
            .attr("class", "eggHeader");

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(pokeGroups)
        .enter()
        .append("tr")

    
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip");
    
    
    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return pokeGroups.map(function(column) {
                return row; });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d; })
            .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(allInEggGroup(d));
                });
});

function getEggGroup(pokemon){
    var pokeGroups = new Array();
    for(var i = 0; i < eggGroupData.length; i++){
       if(eggGroupData[i].species == pokemon) pokeGroups.push(eggGroupData[i].egg_group);
   }
    return pokeGroups;
}

function updateEggs(){
    comparingPokemon = document.getElementById("eggGroupPokemon").value;
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
    breedingOutcome(pokemon, comparingPokemon);
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
    console.log(eggGroupData);
    for(var i = 0; i < eggGroupData.length; i++){
        if(eggGroupData[i].egg_group == type) allInGrp.push(eggGroupData[i].species);
    }
    return allInGrp;
}

