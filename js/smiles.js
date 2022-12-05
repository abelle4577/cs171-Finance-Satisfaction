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

        let filteredData = vis.data.filter(d => d["Consumer disputed?"] != "")
        vis.displayData = d3.rollup(filteredData, v => v.length, d => d.Product, d => d["Consumer disputed?"]);
        // console.log(vis.displayData)

        // remove '' from the displayData object
        // *** PROBLEM: I can't figure out how to remove the '' from the object
        vis.displayData.delete('');
        // remove '' from consumer disputed



        console.log(vis.displayData)


        // convert the data to an array of objects
        // vis.displayData = Array.from(vis.displayData, ([key, value]) => ({key, value}));
       

        console.log(vis.displayData)

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // for each product category count the number of "No" and "Yes" responses in the "Consumer disputed?" column

        // create a group for each product category
        let groups = vis.svg.selectAll("g")
            .data(vis.displayData)
            .join("g")
            .attr("transform", (d, i) => 
                // if i < 6, then x position is i * 100 and y is vis.height/3, else x position is (i - 6) * 100 and y is vis.height*2/3
                `translate(${i < 6 ? i * (vis.width/6) +50: (i - 6) * (vis.width/6) +50}, ${i < 6 ? vis.height/6 : vis.height*2/3})`
                // `translate(${i * 100 + 50}, ${vis.height / 2})`
                
                );
        
        
        // make a donut pie chart
        // No willbe one category and Yes will be another category
        // all donut charts will have the same radius
        // the ratio of of yes to no will be in the middle of the donut chart
        // the size of the donut chart will be proportional to the number of complaints for that product category

        // create a donut chart for each product category
        let donut = groups.selectAll("path")
            .data(d => d3.pie().value(d => d[1])(d[1]))
            .join("path")
            .attr("d", d3.arc() 
                .innerRadius(30)
                .outerRadius(50)
                )
                // fill should be red if the value is 
            .attr("fill", d => d.data[0] === "No" ? "#D55E00" : "#56B4E9")

      

        // labels for each product category
        groups.append("text")
            .text(d => d[0])
            .attr("text-anchor", "middle")
            .attr("y", 75)

        // add the % of yes in the middle of the donut chart
        groups.append("text")
            .text(d => (d[1].get("Yes") / (d[1].get("Yes") + d[1].get("No")) * 100).toFixed(2) + "%")
            .attr("text-anchor", "middle")
            .attr("y", 0)
            .attr("font-size", "17px")
            .attr("font-weight", "bold")

            // add a legend for the colors below the donut charts
            // add a legend for the colors below the donut charts
        vis.svg.append("text")
            .text("Yes")
            .attr("x", vis.width/2 - 50)
            .attr("y", vis.height -20)
            .attr("fill", "#56B4E9")
            .attr("font-size", "17px")
            .attr("font-weight", "bold")

        vis.svg.append("text")

            .text("No")
            .attr("x", vis.width/2 + 50)
            .attr("y", vis.height - 20)
            .attr("fill", "#D55E00")
            .attr("font-size", "17px")
            .attr("font-weight", "bold")





    }

}


