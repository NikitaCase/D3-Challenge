// Setting Parameters for the chart area
var  svg_width  =  1024;
var  svg_height  =  600;

var margin = { top: 40, right: 40, bottom: 70, left: 70 };

var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;

// Defining the SVG and chart area 
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)

var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


// Initialize Axes
var chosen_xaxis = 'healthcare'
var chosen_yaxis = 'poverty'

// Create scales for axes
function createXscale(data, chosen_xaxis) {
    var x_scale = d3.scaleLinear(data, chosen_xaxis)
        .domain(d3.extent(data, d => d[chosen_xaxis]))
        .range([0, width])

    return x_scale
}

function createYscale(data, chosen_yaxis) {
    var y_scale = d3.scaleLinear(data, chosen_yaxis)
        .domain(d3.extent(data, d => d[chosen_yaxis]))
        .range([height, 0])

    return y_scale
}


// Update axes
function updateXaxis(new_xscale, x_axis) {
    var bottom_axis = d3.axisBottom(new_xscale)
    x_axis.transition()
        .duration(1500) // ms 
        .call(bottom_axis)

    return x_axis
}

function updateYaxis(new_yscale, y_axis) {
    var left_axis = d3.axisLeft(new_yscale)
    x_axis.transition()
        .duration(1500) // ms 
        .call(left_axis)

    return y_axis
}


function updateCircles(circles, new_xscale, new_yscale, chosen_xaxis, chosen_yaxis) {
    circle_text.transition()
        .duration(1500)
        .attr("cx", d => new_xscale(d[chosen_xaxis]))
        .attr("cy", d => new_yscale(d[chosen_yaxis]))

    return circles
}

function updateCircleText(circle_text, new_xscale, new_yscale, chosen_xaxis, chosen_yaxis) {
    circle_text.transition()
        .duration(1500)
        .attr("x", d => new_xscale(d[chosen_xaxis]))
        .attr("y", d => new_yscale(d[chosen_yaxis]))

    return circle_text
}

function updateToolTip() {}

// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
// healthcareLow,healthcareHigh,obesity,
// obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228

// Load data from CSV
d3.csv("D3_data_journalism/aseets/data.csv").then(function(data) {


    data.forEach(function(row) {
        // x variables
        row.age = +row.age
        row.poverty = +row.poverty
        row.income = +row.income

        // y variables
        row.healthcare = +row.healthcare
        row.smokes = +row.smokes
        row.obesity = +row.obesity
    })

    // Create new x and y scales
    var x_scale = createXscale(data, chosen_xaxis)
    var y_scale = createYscale(data, chosen_yaxis)

    // Create x and y axes


    // Append new axes
    var new_y = chart.append("g")
        .call(y_axis);

    var new_x = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(x_axis);


    var circles = chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d[chosen_xaxis]))
        .attr("cy", d => y_scale(d[chosen_yaxis]))
        .attr("r", "10")
        .classed("stateCircle", true)

    var circle_text = chart.selectAll(".circleText")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => x_scale(d[chosen_xaxis]))
        .attr("y", d => y_scale(d[chosen_yaxis]))
        .style("font-size", "10")
        .style("text-anchor", "middle")
        .classed("circleText")


    var x_label = chart.append("g")
        .attr("transform", `translate(${width},${height})`)
        .classed("axis_label", true)


    var label_poverty = x_label.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)")
        .classed("active", true)

    var label_age = x_label.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)")
        .classed("active", true)

    var label_income = x_label.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)")
        .classed("active", true)


    var y_label = chart.append("g")
        .attr("transform", "rotate(-90)")
        .classed("axis_label", true)

    var label_healthcare = y_label.append("text")
        .attr("x", 60)
        .attr("y", 0)
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)")
        .classed("active", true)

    var label_smokes = y_label.append("text")
        .attr("x", 40)
        .attr("y", 0)
        .attr("value", "smokes")
        .text("Smokes (%)")
        .classed("active", true)

    var label_obesity = y_label.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("value", "obesity")
        .text("Obese (%)")
        .classed("active", true)

    x_label.selectAll("text").on("click", function() {
        var value = d3.select(this).attr("value")
        if (value != chosen_xaxis) {
            chosen_xaxis = value

            if (chosen_xaxis == "poverty") {
                label_poverty.classed("active", true).classed("inactive", false)
                label_age.classed("inactive", true)
                label_income.classed("inactive", true)

            } else if (chosen_xaxis == "age") {
                label_poverty.classed("inactive", true)
                label_age.classed("active", true).classed("inactive", false)
                label_income.classed("inactive", true)
            } else {
                label_poverty.classed("inactive", true)
                label_age.classed("inactive", true)
                label_income.classed("active", true).classed("inactive", false)
            }
        }
    })





})