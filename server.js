// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

const dict = {};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/:key", (request, response) => {
  // express helps us take JS objects and send them as JSON
  if (request.headers && request.headers['accept']=='application/json'){
    return   response.json(dict[request.params.key]);    
  }
  response.send('<html>'+dict[request.params.key]+JSON.stringify(request.headers));

});

app.put("/:key/:value", (request,response)=>{
  const key = request.params.key;
  const value = request.params.value;
  dict[key]=value;
  response.send('<html><a href="">https://myclip.glitch.me/'+key+'</a>')
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
