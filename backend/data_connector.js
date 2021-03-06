var google = require('googleapis');
var authentication = require("./authentication");
var sheets = google.sheets('v4');

var output = {projects: []};
var weeklySheets = [];

const spreadsheetId = '1Hh8M_eVT2BnR1do6rw063d_erZAhCiwuaIXmJJXp0VI';

function getProjects(project, departments, totalHoursCollumn){

  var sumPm=0;
  var sumDes=0;

  for(var i=0;i<project.length;i++){
    if(departments[i]==="pm"&& !isNaN(parseInt(project[i]))){sumPm+=parseInt(project[i]);};
  };

  for(var i=0;i<project.length;i++){
    if(departments[i]==="des"&& !isNaN(parseInt(project[i]))){sumDes+=parseInt(project[i]);};
  };

  var sumDev = project[totalHoursCollumn] - sumPm - sumDes;

  return {
      kunde: project[0],
      jobnr: project[4],
      project: project[5],
      stunden: project[totalHoursCollumn],
      stundenPm: sumPm,
      stundenDes: sumDes,
      stundenDev: sumDev
    };
}

function rowContainsProject(row){
  if(row[4]==="NEU"||row[4]==="intern"){
    return false;
  }
  else return row[4];
}

function getTotalHoursCollumn(currentWeek){
  for (var i=0;i<26;i++){
    var collumnHeadline = currentWeek.values[4][i];
    if (collumnHeadline==="Last") {
      return i;
    }
  }
  return 7;
}

class DataConnector{

  getSheets(auth) {   //first make one call to get the list of all sheets in the document
    return new Promise((resolve, reject)=>{
      sheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        ranges: [],
      }, (err, response) => {
        if (err) {
          console.log('The API returned an error: ' + err);
        } 
        else {
          for (var i =0; i<response.sheets.length;i++){
            weeklySheets.push(response.sheets[i].properties.title + "!A1:AO80");
          }
          weeklySheets.sort();
          console.log("sheets fetch succesful");
          resolve(this.getData(auth));
        }
      });
    }
  )}

  getData(auth) {     //make a second call to get the data from all sheets
    return new Promise((resolve, reject)=>{
      sheets.spreadsheets.values.batchGet({
          auth: auth,
          spreadsheetId: spreadsheetId,
          ranges: weeklySheets
      }, (err, response) => {
        if (err) {
          console.log('The API returned an error: ' + err);
        } 
        else {
          if (response.valueRanges[1].values.length === 0) {
            console.log('No data found.');
          } 
          else {

            for (var i = 0; i <response.valueRanges.length; i++) {
              var weeklyDepartmentCollumns=[];
              var currentDepartment = "nn";
              var totalHoursCollumn = 7;

              totalHoursCollumn = getTotalHoursCollumn(response.valueRanges[i]);

              for (var j = 0; j<response.valueRanges[i].values[0].length; j++){   
                //build departments array
                if(response.valueRanges[i].values[0][j]==="Beratung & Projektleitung"){currentDepartment="pm"};
                if(response.valueRanges[i].values[0][j]==="Projektleitung"){currentDepartment="pm"};
                if(response.valueRanges[i].values[0][j]==="Kreation"){currentDepartment="des"};
                if(response.valueRanges[i].values[0][j]==="Entwicklung"){currentDepartment="dev"};
                weeklyDepartmentCollumns.push(currentDepartment);
              };
              for (var k = 6; k<response.valueRanges[i].values.length; k++) {
                if(rowContainsProject(response.valueRanges[i].values[k])){
                  output.projects.push({
                    week: JSON.stringify(response.valueRanges[i].range).slice(2,7), 
                    projects: getProjects(response.valueRanges[i].values[k], weeklyDepartmentCollumns, totalHoursCollumn)
                  });
                }
              }
            }
          }
        }
        console.log("data fetch succesful");
        resolve(output);
      });
    })
  }
}


module.exports = new DataConnector();
