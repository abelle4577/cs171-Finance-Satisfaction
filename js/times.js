class Times {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 20, bottom: 40, left: 45};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        let filteredData = [];


        // convert the "Date received" column to a date object
        vis.data.forEach(d => d["Date received"] = new Date(d["Date received"]));


        // filter the data according to the selected product
        if (selectedCategory !== "All") {
            filteredData = vis.data.filter(d => d.Product === selectedCategory);
        } 
        else {
            filteredData = vis.data
        }

        console.log(filteredData)

        // count the total number of entries for each date in "Date received"

        let countByDate = d3.rollup(filteredData, v => v.length, d => d["Date received"]);
        console.log(countByDate)

        // create an array of objects with key and value
        vis.displayData = Array.from(countByDate, ([key, value]) => ({key, value: value}));
        console.log(vis.displayData)

        // sort the data based on "Date received"
        // from the first date to the last date

        vis.displayData.sort((a, b) => a.key - b.key);

        
      

        // console.log(vis.displayData)

        vis.updateVis()
    }

    updateVis() {
        let vis = this; 

        // reset and remove the previous elements
        vis.svg.selectAll("*").remove();




        // make a line graph
        // date is on the x axis
        // number of complaints is on the y axis
        // make x and y scales

        vis.x = d3.scaleTime()
            .domain(d3.extent(vis.displayData, d => d.key))
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData, d => d.value)])
            .range([vis.height, 0]);

        // make x and y axis
        vis.xAxis = d3.axisBottom(vis.x);
        // add a tick every 3 months
        // vis.xAxis.tickFormat(d3.timeFormat("%b %Y"))
        //     .ticks(d3.timeMonth.every(3));




        vis.yAxis = d3.axisLeft(vis.y); 

        // add y axis label
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x", 0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of complaints");

        // add the x axis
        vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("fill", "black")
            .call(vis.xAxis);

        // add x axis label
        vis.svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 35)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Date received");
            

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .call(vis.yAxis)
            .attr("fill", "black");

        // append the line to the svg
        vis.line = d3.line()
            .x(d => vis.x(d.key))
            .y(d => vis.y(d.value));

        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("d", vis.line)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)

    }
}