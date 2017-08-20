// var {FetchData} = require ('./fetch-data'); 

var React = require('react');
var ReactDOM  = require ('react-dom');
var Chart = require('chart.js');

chartId = "myChart";


class LineChart extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {data: null};
	    this._chart = null;
  	}

  	buildChart(chartToBuild, ctxToUse, dataToUse){
  		var labels=[];
  		var data=[];
  		var data2=[];
  		var data3=[];

  		for (var i=0; i<dataToUse.length;i++){
  			labels.push(dataToUse[i].week);
  			data.push(dataToUse[i].stunden);
  			data2.push(dataToUse[i].stundenPm);
  			data3.push(dataToUse[i].stundenDes+dataToUse[i].stundenPm)
  		};

  		chartToBuild = new Chart(ctxToUse, {
	    type: 'line',
	    data: {
	        labels: labels,
	        datasets: [
	        {
	        	label: "PM",
	            data: data2,
	            backgroundColor: 'rgba(143,188,143, 1)',
	            borderColor:'rgba(143,188,143,1)',
	            borderWidth: 2,
	            lineTension: 0.4,
	            pointStyle:'circle',
	            pointRadius: 0,
	        },
	       	{
	        	label: "Design",
	            data: data3,
	            backgroundColor: 'rgba(176,224,230, 1)',
	            borderColor:'rgba(176,224,230, 1)',
	            borderWidth: 2,
	            lineTension: 0.4,
	            pointStyle:'circle',
	            pointRadius: 0,
	        },
	        {
	            label: "Entwicklung",
	            data: data,
	            backgroundColor: 'rgba(210,180,140, 1)',
	            borderColor:'rgba(210,180,140,1)',
	            borderWidth: 2,
	            lineTension: 0.4,
	            pointStyle:'circle',
	            pointRadius: 0,
	        }
	        ]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
  	}

  	render() {
  		return <canvas id="myChart" width="800" height="300"/>;
  	}

    componentDidMount() {
    	var ctx = document.getElementById("myChart");
       	this.buildChart(this._chart,ctx, this.props.projectData.data);
    }

    componentDidUpdate() {
    	var ctx = document.getElementById("myChart");
       	this.buildChart(this._chart,ctx, this.props.projectData.data);
    }
};

module.exports = LineChart;