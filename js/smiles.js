// we are going to create two circles using D3
// the radius of the circles will be based on the data from the csv file

// first load in the data from Consumer_Complaints.csv

d3.csv("data/Consumer_Complaints.csv", (row) => {
    // convert if necessary
    
    return row
}).then( (data) => {

    // count the the number of "No" responses in the Consumer disputed? column
    // and the number of "Yes" responses in the Consumer disputed? column
    // store the results in an object
    // the keys should be "No" and "Yes"
    // the values should be the number of responses for each key
    // ignore the "NaN" values

    let disputedData = {
        "No": 0,
        "Yes": 0
    }
    
    data.forEach( (d) => {
        if(d["Consumer disputed?"] === "No")
            disputedData["No"]++
        else if(d["Consumer disputed?"] === "Yes")
            disputedData["Yes"]++
    })
    console.log(disputedData)

    // use d3 to select the div with the id of "smile-chart"
    // and append an svg element to it
    // set the width and height of the svg element

    let svg = d3.select("#smile-chart").append("svg")
        .attr("width", 800)
        .attr("height", 500)

    // append a circle to the svg for every key in the disputedData object
    // the radius of the circle should be the value of the key
    // the x position of the circle should be based on the index of the key
    // the y position of the circle should be 100
    // the fill of the circle should be based on the key
    // the circle should have a red fill for "No"
    // the circle should have a green fill for "Yes"

    let keys = Object.keys(disputedData)
    let values = Object.values(disputedData)
    let colors = ["red", "green"]
    let x = 100
    let y = 150


    svg.selectAll("circle")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => {
            x += i * 100
            return x
        })
        .attr("cy", y)
        .attr("r", (d, i) => {
            return (values[i] / 8000)
        }
        )
        .attr("fill", (d, i) => {
            return colors[i]
        }
        )

        // when a product is selected from the dropdown menu with the id of "product", filter the data based on the selected product
        // update the chart with the filtered data
        // remove the old chart and create a new chart with the filtered data

        d3.select("#product").on("change", (event) => {
            let selectedProduct = d3.select("#product").property("value")
            let filteredData = data.filter( (d) => {
                if (d.Product != "All") {
                    return d.Product === selectedProduct
                }
                else {
                    return d
                }
            })

            let disputedData = {
                "No": 0,
                "Yes": 0
            }
            
            filteredData.forEach( (d) => {
                if(d["Consumer disputed?"] === "No")
                    disputedData["No"]++
                else if(d["Consumer disputed?"] === "Yes")
                    disputedData["Yes"]++
            })

            // use d3 to select the div with the id of "smile-chart"
            // and append an svg element to it
            // set the width and height of the svg element

            var svg = d3.select("#smile-chart").transition();

            // append a circle to the svg for every key in the disputedData object
            // the radius of the circle should be the value of the key
            // the x position of the circle should be based on the index of the key
            // the y position of the circle should be 100
            // the fill of the circle should be based on the key
            // the circle should have a red fill for "No"
            // the circle should have a green fill for "Yes"

            let keys = Object.keys(disputedData)
            let values = Object.values(disputedData)
            let colors = ["red", "green"]
            let x = 100
            let y = 150


            svg.selectAll("circle")
                // .data(keys)
                // .enter()
                // .append("circle")
                .attr("cx", (d, i) => {
                    x += i * 100
                    return x
                })
                .attr("cy", y)
                .attr("r", (d, i) => {
                    return (values[i] / 5000)
                }
                )
                .attr("fill", (d, i) => {
                    return colors[i]
                }
                )

                // add text to the svg for every key in the disputedData object
                

                svg.selectAll("text")
                    .data(keys)
                    .enter()
                    .append("text")
                    .attr("x",200)
                    .attr("y", 200)
                    .attr("text-anchor", "middle")
                    .transition()
                    .text( (d) => {
                        return d
                    }
                    )
                    .exit()
                    .remove()
        })



    // add a title to the svg element that says "Do consumers feel that their complaints are resolved?'

    svg.append("text")
        .attr("x", 100)
        .attr("y", 50)
        .text("Do consumers feel that their complaints are resolved?")
        .attr("font-size", "20px")
        .attr("fill", "black")

   
    

})

