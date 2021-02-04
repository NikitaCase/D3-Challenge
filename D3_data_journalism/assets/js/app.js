// Define Chart dimensions
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

// Create svg and chart areas
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)


var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,
//incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,
// obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228

// Read data from CSV
d3.csv('D3_data_journalism/assets/data/data.csv').then(function(data) {

    // parse data as integers
    data.forEach(function(row) {
        row.healthcare = +row.healthcare
        row.poverty = +row.poverty
    })

    // create x and y scales 
    var x_scale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) * 0.98, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // create axes
    var x_axis = d3.axisBottom(x_scale)
    var y_axis = d3.axisLeft(y_scale);

    // append axes
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(x_axis);

    chart.append("g")
        .call(y_axis);


    // append circles and text
    var circles = chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d.poverty))
        .attr("cy", d => y_scale(d.healthcare))
        .attr("r", 12)
        .classed("stateCircle", true)

    chart.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => x_scale(d.poverty))
        .attr("y", d => y_scale(d.healthcare))
        .style("text-anchor", "middle")
        .style("font-size", "10")
        .classed("stateText", true)
        .attr("alignment-baseline", "central");


    // append axis labels
    svg.append("text")
        .attr("transform", `translate(${width/2}, ${svg_height - 25})`)
        .text("In Poverty (%)")


    svg.append("text")
        .attr("transform", `translate(15, ${svg_height/2}), rotate(-90)`)
        .text("Lacks Healthcare (%)")


    // Create tooltip div
    var tooltip = d3.tip().attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(data) {

            return `<div> ${data.state}:<br>
            Poverty (%): ${data.poverty}<br>
            Healthcare (%): ${data.healthcare}
            </div>`
        });

    // Attach tooltips to chart
    chart.call(tooltip);

    // Add listener for tooltips on mouseover
    circles.on("mouseover", function(data) { tooltip.show(data, this); })
        .on("mouseout", function(data) { tooltip.hide(data, this) });


}).catch(function(error) { console.log(error) })