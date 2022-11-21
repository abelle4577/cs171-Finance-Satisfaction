console.log("let's get started!")


// we are going to create a donut pie chart using the d3 library
// we will use the data from the csv file to create the chart

// first load in the data from Consumer_Complaints.csv

d3.csv("data/Consumer_Complaints.csv", (row) => {
    // convert if necessary
    
    
    return row
}).then( (data) => {
    // group the data by Product
    let groupedData = d3.group(data, d => d.Product)
    console.log(groupedData)
    // create an array of objects with the product name and the number of complaints
    // do this by counting the number of items in each group
    let productData = []
    groupedData.forEach( (value, key) => {
        productData.push({
            product: key,
            count: value.length
        })
    })
    console.log(productData)

    // sort the data based on the number of complaints
    productData.sort( (a, b) => {
        return b.count - a.count
    })
    console.log(productData)

    // use d3 to select the div with the id of "pie-chart"
    // and append an svg element to it
    // set the width and height of the svg element
    // and set the radius of the donut pie chart
    // we will use the radius to position the elements in the center of the svg element

    let svg = d3.select("#pie-chart").append("svg")
        .attr("width", 800)
        .attr("height", 500)
    let radius = 200

    // create a color scale
    // we will use this to assign a color to each product
    // we will use the product name as the domain
    // and the color as the range
    // we will use the colorbrewer scheme Set3
    // https://colorbrewer2.org/#type=qualitative&scheme=Set3&n=12

    let color = d3.scaleOrdinal()
        .domain(productData.map(d => d.product))
        .range(d3.schemeSet3)

    // create a pie generator
    // we will use this to create the pie chart
    // we will use the count as the value
    // and the product name as the key

    let pie = d3.pie()
        .value(d => d.count)
        .sort(null)

    // create an arc generator
    // we will use this to create the arcs of the pie chart
    // we will use the radius to set the inner and outer radius
    // we will use the pie generator to set the start and end angles

    let arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8)

    // create an outer arc generator
    // we will use this to create the outer arcs of the pie chart
    // we will use the radius to set the inner and outer radius
    // we will use the pie generator to set the start and end angles

    let outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // create a label generator
    // we will use this to create the labels of the pie chart
    // we will use the outer arc generator to set the start and end angles
    // we will use the radius to set the distance from the center of the pie chart

    let label = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // create a donut pie chart
    // we will use the svg element to append a g element
    // we will use the g element to append the pie chart elements
    // we will use the pie generator to create the pie chart
    // we will use the color scale to set the color of each arc
    // we will use the arc generator to create the arcs of the pie chart
    // we will use the outer arc generator to create the outer arcs of the pie chart
    // we will use the label generator to create the labels of the pie chart

    let g = svg.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")")

    g.selectAll(".arc")
        .data(pie(productData))
        .enter().append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", arc)
        .style("fill", d => color(d.data.product))

    g.selectAll(".outer-arc")
        .data(pie(productData))
        .enter().append("g")
        .attr("class", "outer-arc")
        .append("path")
        .attr("d", outerArc)
        .style("fill", d => color(d.data.product))


        // only show labels that are greater than 5%
        // only show labels when the pie chart is hovered over
        // show the product name and the percentage of complaints
        // show the label on the outer arc

    // g.selectAll(".outer-arc")
    //     .append("text")
    //     .attr("transform", d => {
    //         let pos = label.centroid(d)
    //         pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1)
    //         return "translate(" + pos + ")"
    //     })
    //     .attr("dy", "0.35em")
    //     .attr("text-anchor", d => midAngle(d) < Math.PI ? "start" : "end")
    //     .text(d => {
    //         if (d.data.count / data.length > 0.05) {
    //             return d.data.product + " (" + Math.round(d.data.count / data.length * 100) + "%)"
    //         }
    //     })



    g.selectAll(".label")
        .data(pie(productData))
        .enter().append("g")
        .attr("class", "label")
        .append("text")
        .attr("transform", d => "translate(" + label.centroid(d) + ")")
        .attr("dy", "0.35em")
        .text(d => d.data.product)

    // create a legend
    // we will use the svg element to append a g element
    // we will use the g element to append the legend elements
    // we will use the color scale to set the color of each legend element
    // we will use the product name as the text of each legend element

    let legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(productData)
        .enter().append("g")
        .attr("transform", (d, i) => "translate(0," + i * 21 + ")")

    legend.append("rect")
        .attr("x", 600)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", d => color(d.product))

    legend.append("text")
        .attr("x", 590)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d.product)
    
    // make the legend interactive
    // we will use the legend elements to create a tooltip
    // we will use the mouseover event to show the tooltip
    // we will use the mouseout event to hide the tooltip
    // we will use the mousemove event to move the tooltip
    // not yet implemented


    legend.on("mouseover", (event, d) => {
        d3.select("#pie-chart")
            .append("div")
            .attr("id", "tooltip")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 25 + "px")
            .style("display", "inline-block")
            .html((d.product) + "<br>" + (d.count))
    })
    legend.on("mouseout", (d) => {
        d3.select("#tooltip")
            .style("display", "none")
    })
    // legend.on("mousemove", (event, d) => {
    //     d3.select("#tooltip")
    //         .style("left", event.pageX + 10 + "px")
    //         .style("top", event.pageY - 25 + "px")
    // })


// when an item in the legend is clicked
// we will use the product name to filter the data
// this data will be used in smiles.js to change the circle size
// create a global variable with the product name
// this variable will be used in smiles.js to filter the data
// store the product name in the global variable


    // legend.on("click", (event, d) => {
    //     let product = d.product
    //     let filteredData = data.filter(d => d.product == product)
    //     window.product = product
    //     window.filteredData = filteredData
    //     console.log(filteredData)
    //     console.log(product)
    //     console.log(window.product)
    //     console.log(window.filteredData)
    //     drawSmiles(filteredData)
    // })




    // create a title
    // we will use the svg element to append a text element
    // we will use the text element to display the title

    svg.append("text")
        .attr("x", 250)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Number of complaints by product")

})
    
