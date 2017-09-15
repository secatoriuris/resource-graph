// var now = new Date("2017-01-01");

// now.setDate(now.getDate()+7);
// console.log(now.toISOString().slice(0,10));


function getWeeks (year){

  weeks=[];
  
  var currentWeekStart=new Date();
  var currentWeekEnd=new Date();

  firstDayInFirstWeek= new Date(year+"-01-01");
  while(firstDayInFirstWeek.getDay()!==1){
    firstDayInFirstWeek.setDate(firstDayInFirstWeek.getDate()+1);
    

  };

  currentWeekStart=firstDayInFirstWeek;
  currentWeekEnd=firstDayInFirstWeek;

  currentWeekEnd.setDate(firstDayInFirstWeek.getDate()+6);

  console.log(currentWeekStart);
  console.log(currentWeekEnd);

  for (i=1;i<=52;i++){
  currentWeek={
              name: "",
              weekStart:"",
              weekEnd:""};



    if(i<10){
          currentWeek.name="KW0"+i;
    }
    else  currentWeek.name="KW"+i;

    currentWeek.weekStart=currentWeekStart.toISOString().slice(0,10);
    currentWeek.weekEnd=currentWeekEnd.toISOString().slice(0,10);

    weeks.push(currentWeek);
    currentWeekStart.setDate(currentWeekEnd.getDate()+1);
    currentWeekEnd.setDate(currentWeekStart.getDate()+6);
  }


  console.log(weeks);
}

getWeeks(2017);