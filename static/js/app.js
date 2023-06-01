// Define a function to identify the max values
function findIndicesOfMax(arr, count) {
    var outp = [];
    for (var i = 0; i < arr.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) { return arr[b] - arr[a]; }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    outp.reverse();

    return outp;
}

// Create a function to graph an individual's OTU data
function getIndOtuData(individual, data) {
    let indID = data.names.indexOf(individual);
    let indData = data.samples[indID];
    let indMetadata = data.metadata[indID];
    let names = data.names;

    let topTenOTUIndices = findIndicesOfMax(indData.sample_values, 10);
    let topOTUs = topTenOTUIndices.map((index) => {
        return indData.sample_values[index];
    });
    let topOTUIds = topTenOTUIndices.map((index) => {
        return indData.otu_ids[index];
    });
    let topOTULabels = topTenOTUIndices.map((index) => {
        return indData.otu_labels[index];
    });

    var trace = {
        x: topOTUs,
        y: topOTUIds.map(d => "OTU " + d),
        text: topOTULabels,
        type: "bar",
        orientation: "h"
    };
    var layout = {
        title: "Top 10 OTUs"
    };
    
    Plotly.newPlot("bar", [trace], layout);

    trace = {
        x: indData.otu_ids,
        y: indData.sample_values,
        text: indData.otu_labels,
        mode: 'markers',
        marker: {
          size: indData.sample_values,
          color: indData.otu_ids,
          colorscales: 'YlGnBu'
        }
      };
      
    data = [trace];
      
    layout = {
        title: 'Belly Button Biodiversity Bubble Chart',
        showlegend: false,
    };
      
    Plotly.newPlot('bubble', data, layout);

    var info_container = document.getElementById('sample-metadata');

    for (var key in indMetadata) {
        var p = document.createElement('p');
        p.innerHTML = key + ': ' + indMetadata[key];
        info_container.appendChild(p);
    }

    var select_container = document.getElementById("selDataset");
    console.log(names);

    for (var id in names) {
        var op = document.createElement("option");
        op.value = names[id];
        op.innerText = names[id];
        if (names[id] == individual) {
            op.selected = true;
        }

        select_container.appendChild(op);
    }
}

// Read in the data from samples.json
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    if (id == null) {
        id = "940";
    }    
    getIndOtuData(id, data);
});

function optionChanged(val) {
    window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + `?id=${val}`;
}