// converting the old_smiles.js code to be using a class


class Smiles {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        // for each product category count the number of "No" and "Yes" responses in the "Consumer disputed?" column
        let groupedData = d3.group(vis.data, d => d.Product, d => d["Consumer disputed?"]);
        console.log(groupedData)

        // create an array of objects with key and value
        vis.displayData = 

        // sort the data based on the number of complaints
        vis.displayData.sort((a, b) => b.value - a.value);

        // console.log(vis.displayData)


        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // for each product category count the number of "No" and "Yes" responses in the "Consumer disputed?" column
        // make a red circle for each "No" and a green circle for each "Yes"
        // the size of the circle should be proportional to the number of "No" and "Yes" responses
        

        vis.svg.selectAll("circle")
            .data(vis.displayData)
            .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", d => d.color)
    }


    

})


