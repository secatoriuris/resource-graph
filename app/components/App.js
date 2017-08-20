// var {FetchData} = require ('./fetch-data'); 

var React = require('react');
var ReactDOM  = require ('react-dom');
var axios = require('axios');
var LineChart = require('./line-chart');
var ProjectSelector = require('./project-selector');

class App extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {selectedProject: "76808 LAV Relaunch"};
	    this.getData = this.getData.bind(this);
	    this.changeProject = this.changeProject.bind(this);
  	}

  	changeProject(newProject){
  		this.setState({selectedProject: newProject});
  	}

  	getStundenGesamt(project){
  		var sums = {
  				total: 0,
  				pm: 0,
  				des: 0,
  				dev: 0
  			};

	  	for(var i=0; i<project.length;i++){
	  		sums.total += parseInt(project[i].stunden);
	  		sums.pm += parseInt(project[i].stundenPm);
	  		sums.des += parseInt(project[i].stundenDes);
	  	};

	  	sums.dev = sums.total-sums.pm-sums.des;
  		return sums;
  	}

	getData(){
		var context = this;
		axios.get('http://localhost:3000')
  		.then(function (response) {
			context.setState(response.data);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	}

	fillKundenId(){
		var currentKunde = "";
		for(var i=0;i<this.state.projects.length;i++){
			if(this.state.projects[i].projects.kunde!==""){
				currentKunde=this.state.projects[i].projects.kunde;
			}
			else {
					this.state.projects[i].projects.kunde=currentKunde;
			}
		}
	}


	// filterItems(items){
	// 	var allItems = [];
	// 	for(var i=0;i<items.length;i++){
	// 		if(items[i].week==="KW 01"){
	// 			if((items[i].projects.project!==undefined)&&(items[i].projects.stunden!=="0")){
	// 				allItems.push({jobnr: items[i].projects.jobnr, stunden: items[i].projects.stunden});
	// 			}
	// 		}
	// 	}
	// 	return allItems;
	// }

	getProjectData(allProjects, selectedProject){
		var selectedProjectNumber=selectedProject.slice(0,5);
		var project = [];

		for(var i=0;i<allProjects.length;i++){
			if(allProjects[i].projects.jobnr===selectedProjectNumber){
				project.push({	week: allProjects[i].week, 
								stunden: allProjects[i].projects.stunden,
								stundenPm: allProjects[i].projects.stundenPm,
								stundenDes: allProjects[i].projects.stundenDes});
			}
		}
		return project;
	}

	componentWillMount(){
			this.getData();
	}

  	render() {
		if(!this.state.projects){
			return <div>no data yet</div>;
		}
		else {
			this.fillKundenId();
			var gesamtAufwaende = this.getStundenGesamt(this.getProjectData(this.state.projects, this.state.selectedProject));
		    return (
		    	<div>
		    		<h1>SIRUP - Aufwände 2017 laut PM-Planung</h1>
		    		<h2>{this.state.selectedProject}</h2>
		    		<ProjectSelector projects={this.state.projects} onChange={this.changeProject}/>
		    		<LineChart 	projectData={{	data: this.getProjectData(this.state.projects, this.state.selectedProject),
		    									name: this.state.selectedProject}} />
		    		<h2>Aufwand gesamt: {gesamtAufwaende.total} Stunden / {parseInt(gesamtAufwaende.total/8)} Tage</h2>
		    		<span><b>PM:</b> {gesamtAufwaende.pm} Stunden | </span>
		    		<span><b>Design:</b> {gesamtAufwaende.des} Stunden | </span>
		    		<span><b>Development:</b> {gesamtAufwaende.dev} Stunden</span>
				</div>
		    	);
		    }
  	}
};

module.exports = App;