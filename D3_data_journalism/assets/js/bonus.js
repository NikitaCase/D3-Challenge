// set up chart parameters
var svg_width = 1000;
var svg_height = 600;

var margin = { top: 40, right: 40, bottom: 80, left: 100 };

var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;

// Defining the SVG and chart area 
var svg = d3.select("#scatter")
    .append("svg")
    .classed("chart", true)
    .attr("width", svg_width)
    .attr("height", svg_height);

var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Axes
var chosen_x_axis = "poverty";
var chosen_y_axis = "healthcare";

//----------------------------------------------------------------------------------

// Create scales for axes
function createXscale(data, chosen_x_axis) {
    var x_scale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosen_x_axis]))
        .range([0, width])
    return x_scale
};

function createYscale(data, chosen_y_axis) {
    var y_scale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosen_y_axis]))
        .range([height, 0])
    return y_scale
};
// function to redraw x-axis
function updateXaxis(new_xscale, x_axis) {
    var bottom_axis = d3.axisBottom(new_xscale);
    x_axis.transition()
        .duration(1000)
        .call(bottom_axis)
    return x_axis
};
// function to redraw y-axis
function updateYaxis(new_yscale, y_axis) {
    var left_axis = d3.axisLeft(new_yscale);
    y_axis.transition()
        .duration(1000)
        .call(left_axis)
    return y_axis
};
// function to render circles with new values
function updateCircles(circles, new_xscale, chosen_x_axis, new_yscale, chosen_y_axis) {
    circles.transition()
        .duration(1000)
        .attr("cx", d => new_xscale(d[chosen_x_axis]))
        .attr("cy", d => new_yscale(d[chosen_y_axis]))
    return circles
};
// function to render text in circles
function updateCircleText(circle_text, new_xscale, chosen_x_axis, new_yscale, chosen_y_axis) {
    circle_text.transition()
        .duration(1000)
        .attr("x", d => new_xscale(d[chosen_x_axis]))
        .attr("y", d => new_yscale(d[chosen_y_axis]))
    return circle_text
};


//----------------------------------------------------------------------------------

// update tooltip based on chosen axes
function updateToolTip(chosen_x_axis, chosen_y_axis, ttip) {
    var x, y

    if (chosen_x_axis == "poverty") { x = "Poverty (%): " } else if (chosen_x_axis == "age") { x = "Age: " } else { x = "Income: "; };

    if (chosen_y_axis == "healthcare") { y = "Healthcare (%): " } else if (chosen_y_axis == "smokes") { y = "Smokes (%): " } else { y = "Obesity (%): " };

    var div = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return `<div> ${d.state} <br>
                ${x} ${d[chosen_x_axis]} <br>
                ${y} ${d[chosen_y_axis]} </div>`;
    });

    ttip.call(div);

    ttip.on("mouseover", function(d) { div.show(d, this); })
        .on("mouseout", function(d) { div.hide(d, this) });
    return ttip
};


//----------------------------------------------------------------------------------

// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
// healthcareLow,healthcareHigh,obesity,
// obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228
// load csv data 
d3.csv('D3_data_journalism/assets/data/data.csv').then((census_data) => {

    // Parse varibles from csv as integers
    census_data.forEach(function(data) {
        //x variables 
        data.age = +data.age
        data.poverty = +data.poverty
        data.income = +data.income

        // y variables
        data.healthcare = +data.healthcare
        data.smokes = +data.smokes
        data.obesity = +data.obesity
    });

    // Create new x and y scales
    var x_scale = createXscale(census_data, chosen_x_axis);
    var y_scale = createYscale(census_data, chosen_y_axis);

    // Create x and y axes
    var bottom_axis = d3.axisBottom(x_scale);
    var left_axis = d3.axisLeft(y_scale);

    // Append new axes
    var x_axis = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottom_axis);

    var y_axis = chart.append("g")
        .call(left_axis);

    // Append circles and circle text 
    // var circles = chart.selectAll('circle')
    //     .data(census_data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => x_scale(d[chosen_x_axis]))
    //     .attr("cy", d => y_scale(d[chosen_y_axis]))
    //     .attr("r", 10)
    //     .classed("stateCircle", true)

    // var circle_text = chart.selectAll('.stateText')
    //     .data(census_data)
    //     .enter()
    //     .append("text")
    //     .text(d => d.abbr)
    //     .attr("x", d => x_scale(d[chosen_x_axis]))
    //     .attr("y", d => y_scale(d[chosen_y_axis]))
    //     .classed("stateText", true)
    //     .attr("font-size", "12")
    //     .attr("alignment-baseline", "central")
    var circles = chart.selectAll()
        .data(census_data)
        .enter()
        .append("circle")
        .attr("class", d => d.abbr)
        .attr("cx", d => x_scale(d[chosen_x_axis]))
        .attr("cy", d => y_scale(d[chosen_y_axis]))
        .attr("r", 12)
        .classed("stateCircle", true)

    var circle_text = chart.selectAll()
        .data(census_data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => x_scale(d[chosen_x_axis]))
        .attr("y", d => y_scale(d[chosen_y_xis]))
        .attr("class", "stateText")
        .attr("font-size", "10")
        .attr("alignment-baseline", "central");


    var circles, circle_text = updateToolTip(chosen_x_axis, chosen_y_axis, circles, circle_text);

    // x axis labels
    var x_label = chart.append("g")
        .attr("class", "x-labels")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var label_poverty = x_label.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .attr("class", "active")
        .text("In Poverty (%)");

    var label_age = x_label.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .attr("class", "inactive")
        .text("Age (Median)");

    var label_income = x_label.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .attr("class", "inactive")
        .text("Household Income (Median)");

    // y axis labels
    var y_label = chart.append("g")
        .attr("class", "y-labels")
        .attr("transform", "rotate(-90)");

    var label_healthcare = y_label.append("text")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "active")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var label_smokes = y_label.append("text")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "inactive")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var label_obesity = y_label.append("text")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "inactive")
        .attr("value", "obesity")
        .text("Obese (%)");

    // listener for click on x axis label     
    x_label.selectAll("text")
        .on("click", function() {

            // reassign x parameter
            var value = d3.select(this).attr("value");
            if (value !== chosen_x_axis) {
                chosen_x_axis = value;

                console.log(value, chosen_x_axis)

                // create new x scale and axis
                x_scale = createXscale(census_data, chosen_x_axis);
                x_axis = updateXaxis(x_scale, x_axis);


                // update circle and text positions
                circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);
                circle_text = updateCircleText(circle_text, x_scale, chosen_x_axis, y_scale, chosen_y_axis);

                // update tooltips
                circles, circle_text = updateToolTip(chosen_x_axis, chosen_y_axis, circles, circle_text);

                // make selected label bold
                if (chosen_x_axis == "poverty") {
                    label_poverty.classed("active", true).classed("inactive", false)
                    label_age.classed("inactive", true)
                    label_income.classed("inactive", true)

                } else if (chosen_x_axis == "age") {
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

    // listener for click on y axis label  
    y_label.selectAll("text")
        .on("click", function() {

            // reassign y parameter
            var value = d3.select(this).attr("value");
            if (value !== chosen_y_axis) {
                chosen_y_axis = value;

                // create new x scale and axis
                y_scale = createYscale(census_data, chosen_y_axis);
                y_axis = updateYaxis(y_scale, y_axis);

                // update circle and text positions
                circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);
                circle_text = updateCircleText(circle_text, x_scale, chosen_x_axis, y_scale, chosen_y_axis);

                // update tooltips
                circles, circle_text = updateToolTip(chosen_x_axis, chosen_y_axis, circles, circle_text);

                // make selected label bold
                if (chosen_y_axis == "poverty") {
                    label_healthcare.classed("active", true).classed("inactive", false)
                    label_smokes.classed("inactive", true)
                    label_obesity.classed("inactive", true)
                } else if (chosen_y_axis == "age") {
                    label_healthcare.classed("inactive", true)
                    label_smokes.classed("active", true).classed("inactive", false)
                    label_obesity.classed("inactive", true)
                } else {
                    label_healthcare.classed("inactive", true)
                    label_smokes.classed("inactive", true)
                    label_obesity.classed("active", true).classed("inactive", false)
                }
            }

        });
}).catch(function(error) {
    console.log(error);
});