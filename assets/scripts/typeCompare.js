
var pokeData, categories, selectVal, pokeType, affected;
d3.csv("assets/data/type_efficacy.csv", function(data) {
    pokeData = data;
    selectVal = document.getElementById("typeCompare").value;
    var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
    pokeType = pokemon.Type1;
    var temp = data[0].type;
    categories = new Array("", temp);
    var comparing = [pokeType, selectVal];
    data.forEach(function(d) {
        if(d.type != temp) categories.push(d.type);
        temp = d.type;
      });
    
    affected = getAffectedCategories(categories, pokeType);
    affected.concat(getAffectedCategories(categories, selectVal));
// render the table
    var table = d3.select("#effectivenessModule").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(affected)
        .enter()
        .append("th")
            .text(function(column) { return column; })
            .attr("class", "th_n");
    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(comparing)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return affected.map(function(column) {
                if(column === "") return {column: row, value: row};
                else return {column: row, value: data[((categories.indexOf(row)-1) * 18) + categories.indexOf(column)].damage_factor/100 + "x"};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; });
});


function updateTypeCompare(){
    selectVal = document.getElementById("typeCompare").value;
    console.log(selectVal);
    //how to get data and categories....?
    var table = d3.select("#effectivenessModule").select("table")[0][0],
            thead = table.tHead,
            tbody = table.tBody;

    var rows = table.rows;
     var cells = rows[2].getElementsByTagName("td");
    cells[0].innerHTML = document.getElementById("typeCompare").value;
    for(var i = 1; i < cells.length; i++){
        cells[i].innerHTML = pokeData[(categories.indexOf(selectVal)-1)*18 + i - 1].damage_factor/100 + "x";
    }
}

function getAffectedCategories(categories, pokemonType){
    var affectedCategories = new Array("");
    for(var i = 1; i < categories.length + 1; i++){
        if(pokeData[(categories.indexOf(pokemonType) - 1)*18 + i - 1].damage_factor != 100) affectedCategories.push(categories[i-1]);   
    }
    return affectedCategories;
}
