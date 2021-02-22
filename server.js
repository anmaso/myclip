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

function haiku(){
  var adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry",
  "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring",
  "winter", "patient", "dawn", 
  "blue", "broken", "cold",  "frosty", "green",
  "long", "late",  "bold", "little", "morning", "muddy", "old",
  "red", "rough", "still", "small", "sparkling",  "shy",
  "wild", "black", "young", "holy", "solitary",
   "snowy", "proud", "floral", "divine",
  , "ancient", "purple", "lively", "nameless", "blue", "red", "yellow", "green", "pink", "orange", "lime",  "brown", "gray", "white"]

  , nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea",
  "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn",
  "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird",
  "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower",
  "firefly", "feather", "grass", "haze", "mountain", "night", "pond",
  "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf",
  "thunder", "violet", "water", "wildflower", "wave", "water", "resonance",
  "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
  "frog", "smoke", "star", "panda", "dog", "cat", "tiger", "cow", "sheep", "hippo", "lion", "koala", "duck", "bird", "elephant", "frog", "puma", "mouse", "chicken", "pig", "horse"];

  return adjs[Math.floor(Math.random()*(adjs.length-1))]+"-"+nouns[Math.floor(Math.random()*(nouns.length-1))];
}


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('view engine', 'pug')

// https://expressjs.com/en/starter/basic-routing.html


app.get("/:key/:value", (request, response) => {
  const key = request.params.key || haiku();
  
  const value = request.params.value;
  dict[key] = value;
  response.redirect("/" + key);
});

// send the default array of dreams to the webpage
app.get("/:key?", (request, response) => {
  var key = request.params.key;
  var random = false;
  if (!key){
    key= haiku();
    random=true;
  }
  var v = dict[key] || {};
  const value = v.value || '';
  const destroy = v.destroy;
  const length= v.length || 0;
  const secret = v.secret || false;
  
  if (destroy){
    delete dict[key];
  }
  

  // express helps us take JS objects and send them as JSON
  if (request.headers && request.headers["accept"] == "application/json") {
    return response.json({  value });
  }
  if (request.headers && request.headers["accept"] == "text/plain") {
    return response.send( value );
  }
  const headers =  JSON.stringify(request.headers)

  
  response.render('index', { key, value, headers, random, length, secret })
});

app.post("/", (request, response) => {
  const key = request.body.key;
  const value = request.body.value;
  const destroy = request.body.destroy;
  const length = request.body.length;
  const secret = request.body.secret==='true';
  
  console.log(request.body);
  dict[key] = {destroy, value, length, secret};
  
  const href='https://myclip.glitch.me/'+key;
  response.render('result', { key, href })
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
