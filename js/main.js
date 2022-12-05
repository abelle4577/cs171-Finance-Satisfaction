// create global variables that will be the graphs
let pieVisChart, mapVis, smileVis, timeVis;
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
    
    smileVis = new Smiles("smile-chart", data);

    timeVis = new Times("time-chart", data);



    // starting the cleopleth map
    // confused on how to merge

     // load data using promises
    //  let promises = [
    //     d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"),
    //     d3.csv("data/Consumer_Complaints.csv")
    // ];

    // Promise.all(promises)
    //     .then(function (data) {
    //         initMainPage(data)
    //     })
    //     .catch(function (err) {
    //         console.log(err)
    //     });

    // // CLOROLPLETH
    // function initMainPage(dataArray) {
    //     // initializes map, takes in all the same data that the data table does
    //     mapVis = new MapVis('mapDiv', dataArray[0], dataArray[1], dataArray[2]);
    // }


    // mapVis = new MapVis("mapDiv", data);



});

// create a function that will be called when the dropdown menu is changed
function dropdownChanged(Product) {
    // update the pie chart
    pieVisChart.wrangleData(Product);
    // update the map
    // mapVis.wrangleData(Product);

    smileVis.wrangleData(Product);

    timeVis.wrangleData(Product);


}

// not sure where to merge this
let selectedCategory = "All";

function selectionChange() {
    selectedCategory = document.getElementById("product").value;
    // myMapVis.wrangleData();
    smileVis.wrangleData();
    timeVis.wrangleData();
}

