function drawBars(data) {

  /**
   * Play with the D3 filter method and understand how it works.
   *
   **/
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.number); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.gpa); })
      .attr("height", function(d) { return height - y(d.gpa); });
}

function drawXAxis(){
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
}

function drawYAxis() {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("GPA");
}

/**
 * Create a preprocessing filter method to remove data for
 * the letter B from the data set
 *
 **/
function isNotDepartment(datum, dept) {
  console.log("Is course " + datum.department + " " + datum.number + " in department " + dept + "?");
  console.log(datum.department != dept);
  return datum.department != dept;
}

function filterDept(dept) {
    console.log("Showing Only Department " + dept);
    svg.selectAll(".bar")
        .style("fill","steelblue")
        .filter(function(d) { return isNotDepartment(d, dept); })
        .transition()
        .duration(function(d) { return Math.random() * 1000; } )
        .delay(function(d) { return d.gpa; })
        .style("fill","white");

}

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
