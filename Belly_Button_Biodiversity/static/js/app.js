

function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`  
  d3.json(url).then(function(sample) {
    console.log(sample)
    console.log(Object.entries(sample))
    console.log(Object.entries(sample)[0])
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var table = d3.select("#sample-metadata");
    var tbody = table.append("tbody");
    var trow = tbody.append("tr");
    for (var i = 0; i < Object.entries(sample).length ; i++){
      trow = tbody.append("tr");
      trow.append("tr").text((Object.keys(sample)[i]) + ":      " + (Object.values(sample)[i]));

     }
  });
}


function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`  
  d3.json(url).then(function(response){
  console.log(response);
  console.log(response.otu_ids)
  console.log(response.sample_values)

  var otu_ids = response.otu_ids;
  var otu_labels = response.otu_labels;
  var sample_values = response.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      type: "scatter",
      text: otu_labels,
      marker: {
        size: sample_values, 
        color: otu_ids
      }
    };

    var data = [trace1];

    var layout = {
      title: "Sample Bubble Chart",
      xaxis: { title: "OTU Ids" },
      yaxis: { title: "Sample Values" },
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', data, layout);
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var ten_otu_ids = response.otu_ids.slice(0,10);
    var ten_otu_labels = response.otu_labels.slice(0,10);
    var ten_sample_values = response.sample_values.slice(0,10);
    console.log(`top 10 otus are ${ten_otu_ids}`)
    console.log(`top 10 values are ${ten_sample_values}`)


    var pie_data = [{
      values: ten_sample_values,
      labels: ten_otu_ids,
      hovertext: ten_otu_labels,
      type: 'pie'
    }];
    
    var pie_layout = {
      title: "Sample Pie Chart",
    };
    
    Plotly.newPlot('pie', pie_data, pie_layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Clear table when new sample is selected
  var tbody = d3.selectAll("tbody");
  tbody.html("");

  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
