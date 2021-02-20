// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var pug = require("pug");

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
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('view engine', 'pug')

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/:key/:value", (request, response) => {
  const key = request.params.key;
  const value = request.params.value;
  dict[key] = value;
  response.redirect("/" + key);
});

// send the default array of dreams to the webpage
app.get("/:key", (request, response) => {
  const key = request.params.key;
  const value = dict[key]
  

  // express helps us take JS objects and send them as JSON
  if (request.headers && request.headers["accept"] == "application/json") {
    return response.json({ [key]: dict[key] });
  }
  const headers =  JSON.stringify(request.headers)

  
  response.render('index', { key, value, headers })
});

app.post("/", (request, response) => {
  const key = request.body.key;
  const value = request.body.value;
  console.log(request.body);
  dict[key] = value;
  response.send('<html><a href="">https://myclip.glitch.me/' + key + "</a>");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
