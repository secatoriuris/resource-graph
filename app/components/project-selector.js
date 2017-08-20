var React = require('react');
var ReactDOM  = require ('react-dom');

class ProjectSelector extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {};
	    this.buildProjectList = this.buildProjectList.bind(this);
	   	this.handleChange = this.handleChange.bind(this);
  	}

  	handleChange(e) {
    	const name = e.target.value;
    	this.props.onChange(name);
  	}

  	buildProjectList(){
  		var uniqueList = []; //for filtering out doubles
  		var optionList = [];

  		for (var i=0;i<this.props.projects.length;i++){
  			if(uniqueList.indexOf(this.props.projects[i].projects.jobnr)===-1 //check, if project is not in the list yet
  				&& this.props.projects[i].projects.jobnr.length===5){
	  				uniqueList.push(this.props.projects[i].projects.jobnr);
	  				optionList.push(<option key={i}>{this.props.projects[i].projects.jobnr} {this.props.projects[i].projects.kunde} {this.props.projects[i].projects.project} </option>);
	  		}
  		};
  		return optionList;
  	}

  	render() {
  		return (
  			<div>
  				  <label>Select Project: </label>
				    <select name="projects" size="1" onChange={this.handleChange}>
				    	{this.buildProjectList()}
				    </select>
  			</div>
  			);
  	}
};

module.exports = ProjectSelector;