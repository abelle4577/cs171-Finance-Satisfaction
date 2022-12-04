/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

// make a cleopleth whose color depth per state indicate the number of complaints by the selected product in the drop-down
class MapVis {

    // not sure what other constructors should be used
    constructor(parentElement, State, Product) {
        this.parentElement = parentElement;
        this.state = State;
        this.product = Product;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initMap()
    }

    initMap () {
        // make margin conventions
        let vis = this;

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

        // adjust map position
        vis.map = vis.svg.append("g") // group will contain all state paths
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // define path generator, using the parentElement projection
        vis.path = d3.geoPath();

        // Convert TopoJSON to GeoJSON (target object = 'states')
        vis.usaGeoData = topojson.feature(vis.mapInfo, vis.mapInfo.objects.states).features

        vis.states = vis.map.selectAll("path")
            .data(vis.usaGeoData)

            .enter()
            .append("path")
            .attr("d", vis.path)
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)

        console.log(vis.states)

        vis.wrangleData()
    }


    wrangleData() {
        let vis = this


        // first, filter according to product type, init empty array
        let filteredData = [];

        // if there is a selected product in the drop-down bar, need help here
        if (Product == "Mortage") {
            filteredData = vis.data.filter(d => d.Product == "Mortage");

        } else if (Product == "Debt collection") {
            filteredData = vis.data.filter(d => d.Product == "Debt collection");
           
        } else if (Product == "Credit reporting") {

            filteredData = vis.data.filter(d => d.Product == "Credit reporting");

        } else if (Product == "Credit card") {

            filteredData = vis.data.filter(d => d.Product == "Credit card");


        } else if (Product == "Bank account or service") {
                
            filteredData = vis.data.filter(d => d.Product == "Bank account or service");
    

        } else if (Product == "Consumer loan") {
                
                filteredData = vis.data.filter(d => d.Product == "Consumer loan");
    
        } else if (Product == "Student loan") {

            filteredData = vis.data.filter(d => d.Product == "Student loan");


        } else if (Product == "Payday loan") {

            filteredData = vis.data.filter(d => d.Product == "Payday loan");

        } else if (Product == "Money transfers") {

            filteredData = vis.data.filter(d => d.Product == "Money transfers");


        } else if (Product == "Prepaid card") {

            filteredData = vis.data.filter(d => d.Product == "Prepaid card");


        } else if (Product == "Other financial service") {
            filteredData = vis.data.filter(d => d.Product == "Other financial service");

        } else if (Product == "Virtual currency") {

            filteredData = vis.data.filter(d => d.Product == "Virtual currency");

        }

        // prepare covid data by grouping all rows by state
        let covidDataByState = Array.from(d3.group(filteredData, d => d.state), ([key, value]) => ({key, value}))

        // have a look
        // console.log(covidDataByState)

        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        // merge
        covidDataByState.forEach(state => {

            // get full state name
            let stateName = nameConverter.getFullName(state.key)

            // init counters
            let totalComplaints = 0;

            // calculate total complaints by summing up all the entries for each state
            state.value.forEach(entry => {
                totalComplaints += +entry['new_case'];
            });

            // populate the final data structure
            vis.stateInfo.push(
                {
                    state: stateName,
                    absComplaints: totalComplaints,
                }
            )
        })

        vis.updateMap()
    }

    // next steps make a color scale
    updateMap() {
        let vis = this;
        console.log("check")

        // make a color scale
        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#136D70"])
            .domain([0, d3.max(vis.stateInfo, d => d[selectedCategory])]);

        vis.states
            .attr("fill", d => {
                let color = 'red'
                console.log(d.properties.name)
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