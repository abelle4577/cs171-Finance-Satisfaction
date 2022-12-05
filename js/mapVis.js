/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

// make a cloropleth whose color depth per state indicate the number of complaints by the selected product in the drop-down
class MapVis {

    // not sure what other constructors should be used
    constructor(parentElement, state, product) {
        this.parentElement = parentElement;
        this.state = state;
        this.product = product;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initMap()
    }

    initMap () {

        

        // make margin conventions
        let vis = this;

        console.log(vis.product)


        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        console.log(vis.height)

        // adjust map position
        vis.map = vis.svg.append("g") // group will contain all state paths
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // define path generator, using the parentElement projection
        vis.path = d3.geoPath();

        // Convert TopoJSON to GeoJSON (target object = 'states')
        vis.usaGeoData = topojson.feature(vis.state, vis.state.objects.states).features

        vis.states = vis.map.selectAll("path")
            .data(vis.usaGeoData)

            .enter()
            .append("path")
            .attr("d", vis.path)
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)



        vis.wrangleData()
    }


    wrangleData() {
        let vis = this

        // first, filter according to product type, init empty array
        let filteredData = [];

        let product = selectedCategory;
        // d3.select("#product").property("value")

        // THE DATA IS NOT BEING FILTERED HERE


        // if there is a selected product in the drop-down bar, filter the data
        // only include data that matches the selected product

        if (product !== "All") {
            filteredData = vis.product.filter(d => d.Product === product)
        } else {
            filteredData = vis.Product
        }
        
        // prepare product data by grouping all rows by state
        vis.productDataByState = d3.rollup(filteredData, v => v.length, d => d.State);
        console.log(vis.productDataByState)


        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        console.log(filteredData)

        // merge
        for (var state of vis.productDataByState.keys()) {
            console.log(state);
            console.log(vis.productDataByState[state])
            // get full state name
            let stateName = nameConverter.getFullName(state)

            // init counters
            let totalComplaints = 0;

            // calculate total complaints by summing up all the entries for each state
            state.value.forEach(entry => {
                totalComplaints += +entry['new_complaint'];
            });

            // populate the final data structure
            vis.stateInfo.push(
                {
                    state: stateName,
                    absComplaints: totalComplaints
                }
            )
        }

        console.log(vis.stateInfo)
        vis.updateMap()
    }

    // next steps make a color scale
    updateMap() {
        let vis = this;
        console.log("check")
        console.log(vis.stateInfo)

        // make a color scale
        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#136D70"])
            .domain([0, d3.max(vis.stateInfo, d => d.absComplaints)]);

            console.log(d3.max(vis.stateInfo, d => d.absComplaints))
            // idk y this is not working

        vis.states
            .attr("fill", d => {
                let color = 'red'
                // console.log(d.properties.name)
                let state = d.properties.name

                vis.stateInfo.forEach(d => {
                    if(state === d.state){
                        color = vis.colorScale(d[selectedCategory]);
                    }
                })
                return color;
            })
    }
}