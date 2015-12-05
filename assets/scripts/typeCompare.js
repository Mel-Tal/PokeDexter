
var width = document.getElementById("effectivenessModule").offsetWidth;

var pokeData, typeNames, categories, selectVal, pokeType1, pokeType2, affected;
d3.csv("assets/data/type_efficacy.csv", function(data) {
    pokeData = data;
    d3.csv("assets/data/types.csv", function(data) {
    typeNames  = data;
    var pokemon = JSON.parse(localStorage.getItem("storageJSON"));
    pokeType1 = pokemon.Type1;
    pokeType2 = pokemon.Type2;

    affected = getAffectedTypes(pokeType1, pokeType2);
    
// render the table
    var table = d3.select("#effectivenessModule").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");
    table.attr("class", "table");
    // append the header row
    thead.append("tr")
        .selectAll("td")
        .data(affected)
        .enter()
        .append("td")      
            .text(function(d) { return d; })          
            .style("color", function(d) {return getTypeColor(d);});
    // create a row for each object in the data
    var rows;
    var t1rowData = getEfficacies(pokeType1, affected);
    t1rowData[0] = pokeType1;
    thead.append("tr")
        .selectAll("td")
        .data(t1rowData).enter()
        .append("td")
            .text(function(d) {
                if (isType(d)) {
                    return d;
                } else {
                    if (d / 100 == .5) {
                        return "1/2X";
                    } 
                    return d / 100 + "X";
                }
                })
            .style("color", function(d) {
                if (isType(d)) {                        
                    return getTypeColor(d);
                } else {
                    if (d == 200) {
                        return "#18AB2C";
                    }
                    if (d == 100) {
                        return "#aaaaaa";
                    }
                    if (d == 50) {
                        return "#CF3D32";
                    }
                    if (d == 0) {
                        return "#202020";
                    }
                }
            });
            
    if (pokeType2 != "none") {      
        var t2rowData = getEfficacies(pokeType2, affected);
        t2rowData[0] = pokeType2;
        thead.append("tr")
            .selectAll("td")
            .data(t2rowData).enter()
                .append("td")
                .text(function(d) {
                    if (isType(d)) {
                        return d;
                    } else {
                        if (d / 100 == .5) {
                            return "1/2X";
                        } 
                        return d / 100 + "X";
                    }})
                .style("color", function(d) {
                    if (isType(d)) {                        
                        return getTypeColor(d);
                    } else {
                        if (d == 200) {
                            return "#18AB2C";
                        }
                        if (d == 100) {
                            return "#aaaaaa";
                        }
                        if (d == 50) {
                            return "#CF3D32";
                        }
                        if (d == 0) {
                            return "#202020";
                        }
                    }
                });
                    
        }
    
});
});

function getEfficacies(type, types) {
    var efficacies = new Array();
    for (var i = 0; i < types.length; i++) {
        efficacies.push(getTypeEfficacy(type, types[i]));
    }
    return efficacies;
}


function updateTypeCompare(){
    selectVal = document.getElementById("typeCompare").value;

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
    var affectedCategories = new Array();
    for(var i = 1; i < categories.length + 1; i++){
        if(pokeData[(categories.indexOf(pokemonType) - 1)*18 + i - 1].damage_factor != 100) affectedCategories.push(categories[i-1]);
    }
    return affectedCategories;
}


function getAffectedTypes(t1, t2) {
    var affectedTypes= new Array("");
    for (var i = 0; i < pokeData.length; i++) {
        if (pokeData[i].type == t1 || pokeData[i].type == t2) {
            if (pokeData[i].damage_factor != 100) {
                if ($.inArray(getTypeName(pokeData[i].target_type_id), affectedTypes) == -1) {
                    affectedTypes.push(getTypeName(pokeData[i].target_type_id));
                }
            }
        }
    }
    return affectedTypes;
}

function getTypeName(typeID) {
    for (var i = 0; i < typeNames.length; i++) {
        if (typeID == typeNames[i].id) {
            return typeNames[i].identifier;
        }
    }
}

function getTypeEfficacy(t1, t2) {
    for (var i = 0; i < pokeData.length; i++) {
        if (pokeData[i].type == t1) {
            if (getTypeName(pokeData[i].target_type_id) == t2) {
                return pokeData[i].damage_factor;
            }
        }
    }
}

function isType(str) {
    str = str.toLowerCase();
    for (var i = 0; i < typeNames.length; i++) {
        if (str == typeNames[i].identifier) {
            return true;
        }
    }
    return false;
}