var dropDown = d3.select('#selDataset');


var dataindexNumber;



// create list for dropdown option using the names from dataset
d3.json('./samples.json').then((data) => {
    var newNames = data.names;
    newNames.forEach(option => dropDown
        .append('option')
        .attr('value',option)
        .text(option)
        );
// console.log(newNames)        
});


// function for when the dropdown is changed. Needs to work with indexNumber
// this function will contain your plotting and Metadata charting
function dropDownChange() { 
    //function for index
    function indexSet(value) {
        d3.json('./samples.json').then((data)=> {
            for(var i=0; i <data.metadata.length; i++) {
                if((data.metadata)[i]['id']=== value) {
                    dataindexNumber = i;
                }
            }
            indexNumber = dataindexNumber
            //call up creatPlots
            createPlots(indexNumber)
            // call up createMetaData
            createMetaData(indexNumber)
        });
    }
    //variable for the dropDownPick and assign that back into function
    var dropDownPick = dropDown.node().value
    indexSet(Number(dropDownPick))
}

//create barchart and bubblechart functions

function createPlots(indexNumber) {
    d3.json('./samples.json').then((data) => {
        // .map to pull the sample_values for charting(bar(top10),bubble)
        var smpValue = data.samples.map(data =>(data.sample_values).slice(0,10))
        var smpBubble = data.samples.map(data =>(data.sample_values))
        // .map to pull the otu_ids for bar and bubble charts, bar chart only uses top 10(slice data)
        var otuId = data.samples.map(data =>(data.otu_ids).slice(0,10))
        var otuBubble =data.samples.map(data =>(data.otu_ids))
        // .map for otu_labels
        var otuLabel = data.samples.map(data =>(data.otu_labels).slice(0,10))
        var labelBubble = data.samples.map(data =>(data.otu_labels))

        // create function for plotly of bar chart
        function barChart(){
            var barChart = {
                x: smpValue[indexNumber],
                y: otuId[indexNumber],
                text: otuLabel[indexNumber],
                type: 'bar',
                orientation: 'h',
                marker: {
                    color: otuId[indexNumber]
                }
            };
            var layout ={
                height: 800,
                width: 500,
                title: '<b>Top 10 Microbe Diversity<b>',
                yaxis: {
                    title: 'OTUs',
                    showgrid: true,},
                xaxis: {
                    title: "Values"}
            };
            Plotly.newPlot('bar', [barChart],layout);
        }
        function bubbleChart(){
            var bubbleChart = {
                x: otuBubble[indexNumber],
                y: smpBubble[indexNumber],
                text: labelBubble[indexNumber],
                mode: 'markers',
                marker : {
                    color: otuBubble[indexNumber],
                    size: smpBubble[indexNumber],
                }
            };
            var bubblelayout = {
                title: '<b>Demographics of Microbe Abundance',
                showlegend: false,
                width: 1000,
                yaxis: {
                    title: "Values",
                    showgrid: true,
                    range: ['min','max']},
                xaxis: {
                    title: 'OTU ID'
                }    
            };
            Plotly.newPlot('bubble', [bubbleChart],bubblelayout);    
        }
        barChart();
        bubbleChart()
    });
}

function createMetaData(indexNumber) {
    // d3 select the html element
    var demoData = d3.select('#sample-metadata');
    // clear out the element
    demoData.html('');
    // Key: Value pairs of the metadata in samples.json
    d3.json('./samples.json').then((data)=>{
        Object.entries(data.metadata[indexNumber])
        .forEach(([key,value]) => demoData.append('p')
        .text(key.toUpperCase() + ': ' + value));
    });
}

function init(){
    indexNumber = 0
    createPlots(indexNumber)
    createMetaData(indexNumber)
}
init()