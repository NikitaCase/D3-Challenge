var  svg_width  =  1024;
var  svg_height  =  600;


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

var chosenXaxis = 'healthcare'
var chosenYaxis = 'poverty'



function create_scales(data, chosenYaxis, chosenXaxis) {
    var y_scale = d3.scaleLinear(data, chosenYaxis)
        .domain(d3.extent(data, d => d[chosenYaxis]))
        .range([height, 0])

    var x_scale = d3.scaleLinear(data, chosenXaxis)
        .domain(d3.extent(data, d => d[chosenXaxis]))
        .range([0, width])

    return y_scale, x_scale
}



function new_axes(x_scale, y_scale) {
       return x_axis, y_axis
}





// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
// healthcareLow,healthcareHigh,obesity,
// obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228


d3.csv("data.csv").then(function(data) {


    data.forEach(function(row){

    // x variables
    row.age = +row.age
    row.poverty = +row.poverty
    row.income = +row.income

    // y variables
    row.healthcare = +row.healthcare
    row.smokes = +row.smokes
    row.obestity = +row.obestity

    })

    var x_scale, y_scale = create_scales(data, chosenXaxis, chosenYaxis)

    var x_axis = d3.axisBottom(x_scale)
    var y_axis = d3.axisBottom(y_scale)

    var new_x = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(x_axis);


    var new_y = chart.append("g")
        .call(y_axis);

    var circles = chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d[chosenXaxis]))
        .attr("cy", d => y_scale(d[chosenYaxis]))
        .attr("r", "10")
        .classed("stateCircle", true)

    var axis_labels = chart.append("g")
                        .attr("transform", `translate(${width/2})`)


})