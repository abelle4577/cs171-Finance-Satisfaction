class PieVis {

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

        console.log(vis.width, vis.height)

        
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.radius = Math.min(vis.width, vis.height) / 2;

        vis.pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        vis.arc = d3.arc()
            .innerRadius(0) // 
            .outerRadius(vis.radius);

      
        vis.color = d3.scaleOrdinal()
            .range(d3.schemeSet3);

        console.log(vis.height, vis.width)

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;
        // console.log(vis.data)
        // group the data by product
        let groupedData = d3.group(vis.data, d => d.Product);
        // console.log(groupedData)

        // create an array of objects with key and value
        vis.displayData = Array.from(groupedData, ([key, value]) => ({key, value: value.length}));

        // sort the data based on the number of complaints
        vis.displayData.sort((a, b) => b.value - a.value);

        // vis.displayData = vis.data;

        // count the total number of entries 
        vis.total = d3.sum(vis.displayData, d => d.value);

        console.log(this.displayData)
        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        let pieGroup = vis.svg.append("g")
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");

        console.log(vis.displayData)

        pieGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))
            .enter().append("g")
            .attr("class", "arc")
            .append("path")
            .attr("d", vis.arc)
            .style("fill", d => vis.color(d.data.key))
            

        // create labels for each arc if there is enough space
        pieGroup.selectAll(".label")
             .data(vis.pie(vis.displayData))
                .enter().append("text")
                .attr("class", "label")
                .text(d => {
                    let percent = (d.data.value / vis.total) * 100;
                    if (percent > 10) {
                        return percent.toFixed(1) + "%";
                    }
                } )
                .style("font-size", "12px")
                .attr("transform", d => "translate(" + vis.arc.centroid(d) + ")")
                .style("text-anchor", "middle");
    
        // create a legend
        let legend = pieGroup.selectAll(".legend")
            .data(vis.color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");
            

              
    }


}