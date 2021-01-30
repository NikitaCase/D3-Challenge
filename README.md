# Health Risks

This project explores health risks in different demographics based on 1 yr ACS estimates from the US census bureau 

### Technology Used

- D3JS
- CSS 
- HTML5


### How it works 
- Data is stored in a csv 
- csv data is parsed using D3
- An svg area is created on the html page
- Positions of points on the page are determined using the scale function 

```javascript
var y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);
```
- Scaled variables are then plotted on the svg in the form of circles on the svg

```javascript
var circles = chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d.poverty))
        .attr("cy", d => y_scale(d.healthcare))
        .attr("r", "10")
        .classed("stateCircle", true)
  ```
 - Text and axes layers are added
 
 
 ### File Structure 
 
 
 ### Screenshots
 
 
