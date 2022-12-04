// create global variables that will be the graphs
let pieVisChart, mapVis, smileVis;
let parseDate = d3.timeParse("%m/%d/%Y");

// load data
d3.csv("data/Consumer_Complaints.csv").then(function(data) {
    // clean data
    data.forEach(function(d) {
        d.date_received = parseDate(d.date_received);
        d.Product = d.Product;
        d.state = d.state;
    });

    // create instances of the visualizations
    pieVisChart = new PieVis("pie-chart", data);
    // mapVis = new MapVis("map-vis", data);
    smileVis = new Smiles("smile-chart", data);

});

// create a function that will be called when the dropdown menu is changed
function dropdownChanged(Product) {
    // update the pie chart
    pieVisChart.wrangleData(Product);
    // update the map
    mapVis.wrangleData(Product);

    smileVis.wrangleData(Product);

}

