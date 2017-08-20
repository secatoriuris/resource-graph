const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var authentication = require("./authentication");
var dataConnector = require("./data_connector");

var output=[];

authentication.authenticate().then((auth)=>{
  dataConnector.getSheets(auth).then((data)=>{
    output=data;
  });
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
  });  
  res.write(JSON.stringify(output));
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});