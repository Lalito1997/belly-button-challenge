function getPlot(id) {
    d3.json("Data/samples.json").then((data) => {
        // this is receiveing the data from the samples.json file in order to have data to work with 
        var samples = data.samples.find(s => s.id.toString() === id);
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        var OTU_top = samples.otu_ids.slice(0, 10).reverse().map(d => "OTU " + d);
        var labels = samples.otu_labels.slice(0, 10);
  // We difined saplevalues and OTU_top above and setting the x and y axcis with it
  // meaing that we are setting up the values for teh bar chart and storign it within trace
        var trace = {
            x: samplevalues,
            y: OTU_top,
            text: labels,
            marker: {
                color: 'blue'
            },
            type: "bar",
            orientation: "h",
        };
// data is acting as an arrray for the trace data
        var data = [trace];
// creating the specifics of the bar chart as in how itll fit and giving it its title  
        var layout = {
            title: "Top 10 OTU",
            yaxis: { tickmode: "linear" },
            margin: { l: 100, r: 100, t: 100, b: 30 }
        };
// by using the plotly library I can then define that I want to create a bar chart 
        Plotly.newPlot("bar", data, layout);
// the bigginning of creating the buibble chart so I had to create a seperate trace
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
//since we are grabbving data from the json file and have already defined these cariables above 
// we can then set them up as markers
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
  
        var layout_b = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };
  
        var data1 = [trace1];
// following the same steps as above when creating a bar chart we are now using
// the libabry to creata a bubble chart
        Plotly.newPlot("bubble", data1, layout_b);
    });
}  
 
// this function grabs meta data from the json file and is digging into the data to grab 
// "metadata" data from id and 
function getInfo(id) {
    d3.json("Data/samples.json").then((data) => {
        var metadata = data.metadata;
        var result = metadata.find(meta => meta.id.toString() === id);
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");
// from var result this is printing the result in <h5> which can be seenw hen inspecting the 
// live server and inspecting it
        Object.entries(result).forEach((entry) => {
            demographicInfo.append("h5").text(entry[0].toUpperCase() + ": " + entry[1]);
        });
    });
}
// at the top we created the function get plot so that 
// everytime we change the id number we trigger the get inof that will populate the rest of the
// dahsboard from data from that specific id. in the code below we trigger the change
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}
//this created the drop down method. and is responsible for creating the change 
// by creating teh "names" from the json file
function init() {
    var dropdown = d3.select("#selDataset");
  
    d3.json("Data/samples.json").then((data) => {
        data.names.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });
  
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}
  
init();
