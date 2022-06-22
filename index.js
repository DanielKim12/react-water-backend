// index.js
// This is our main server file
// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");

const reservoirs = [
  "SHA",
  "ORO",
  "CLE",
  "NML",
  "SNL",
  "DNP",
  "BER"
]
// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// No static server or /public because this server
// is only for AJAX requests
app.use(express.json());

app.post('/query/getData', async function(req, res, next) {
  // api call to get data from CDEC (use cross-fetch)
  // console.log("recieved request")
  // console.log("getting reservoir data", req.body);
  resData = [];
  for (let i=0; i<7; i++) {
    // lookup three schools
    let answer = await lookupReservoirInfo(reservoirs[i],req.body.month, req.body.year);
    resData.push(answer);
  }
  res.json(resData);
  console.log("resData", resData);
  // want the reservoir for given month and year (sent in req) for each 
})
// respond to all AJAX querires with this message

app.use(async function(req, res, next) {
  //let data = await lookupReservoirInfo("SHA","4","2022");
  //console.log(data);
  res.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


async function lookupReservoirInfo(reservoir, month, year) {
  let start = 0;
  let end = 0;
  if (month != 2) {
    start = year+"-"+month+"-1";
    end = year+"-"+month+"-30";
  }
  else {
    start = year+"-"+month+"-1";
    end = year+"-"+month+"-28";
  }
  // console.log("res", reservoir);
  // console.log("start", start);
  // console.log("end",end);
  console.log("start", start, "end", end);
  const api_url= `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${reservoir}&SensorNums=15&dur_code=M&Start=${start}&End=${end}`;
  /*const api_url= `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO&SensorNums=15&dur_code=M&Start=2022-04-01&End=2022-04-30`*/
  let fetch_response = await fetch(api_url);
  let data = await fetch_response.json();
  // console.log("data here",data);
  return {stationId: data[0].stationId, currentStorage: data[0].value};
}

// test api call outside of post req
// console.log("here");
