var svg_width = 900;
var svg_height = 500;

//  ;;;;;;;;;;;;;;;;;;;;;;;;;

var margin = {
  top:40,
  right: 40,
  bottom: 60,
  left: 60
};


var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svg_width)
  .attr("height", svg_height)


var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)


