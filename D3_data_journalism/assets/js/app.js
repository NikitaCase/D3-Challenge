var svg_width = 900;
var svg_height = 500;

//  ;;;;;;;;;;;;;;;;;;;;;;;;;

var margin = {
    top: 40,
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



d3.csv('D3_data_journalism/assets/data/data.csv').then(function(data) {
    data.forEach(function(row) {
        row.healthcare = +row.healthcare
        row.poverty = +row.poverty
    })

    var x_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    var x_axis = d3.axisBottom(x_scale)
    var y_axis = d3.axisLeft(y_scale);

    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(x_axis);

    chart.append("g")
        .call(y_axis);



}).catch(function(error) { console.log(error) })