// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var pug = require("pug");
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
const fs = require('fs');

const PORT = process.env.PORT;
const URL = process.env.URL;
const ACME = process.env.ACME;

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
app.set('view engine', 'pug')


// https://expressjs.com/en/starter/basic-routing.html
/*
app.use(function(req, res, next) {
  var accept = req.headers['accept'] || '';

  if (accept.indexOf('html')>=0){
    return next();
  }
  
  console.log("raw data")
  
  var data = '';
  req.on('data', function(chunk) {
    console.log("chunk", chunk)
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody = data;
    console.log("end",data)
    next();
  });
});
*/
app.use(bodyParser.json({
  verify: function(req, res, buf, encoding){
    console.log('verify')
    if ((req.headers['accept']||'').indexOf('html')<0){
      req.rawBody = buf.toString();
      console.log("rawbody", req.rawBody)
    }
  }
})); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true , 
                               limit: '50mb',
  verify: function(req, res, buf, encoding){
    console.log('verify')
    if ((req.headers['accept']||'').indexOf('html')<0){
      req.rawBody = buf.toString();
      console.log("rawbody", req.rawBody)
    }
  }
})); // for parsing application/x-www-form-urlencoded

app.get("/help", (request, response)=>{
  response.render("help")
})


app.get("/:key/:value", (request, response) => {
  const key = request.params.key || haiku();
  
  const value = request.params.value;
  dict[key] = value;
  response.redirect("/" + key);
});

var headerContains = function(headers, header, str){
  headers = headers || {};
  console.log(headers)
  return (headers[header]||'').toLowerCase().indexOf(str)>=0;
}

var isHTML = function(headers){
  if (headerContains(headers, "accept", "text/plain")) return false;
  if (headerContains(headers, "user-agent",'curl')) return false;
  if (headerContains(headers, "user-agent",'wget')) return false;
  return true;
  
}

var acceptHTML = function(request){
  return headerContains(request.headers, "accept", "html");
}

var isURLEncoded = function(headers){
  return headerContains(headers, "content-type","application/x-www-form-urlencoded");
}

var isFormData = function(headers){
  return headerContains(headers, "content-type", "multipart/form-data");
}

// send the default array of dreams to the webpage
app.get("/:key?", (request, response) => {
  
  var key = request.params.key;
  var format = request.query.format
  console.log("asking for key:"+key+ " format:"+format);
  var random = false;
  if (!key){
    key= haiku();
    random=true;
  }
  var content = fs.existsSync('files/'+key)? JSON.parse(fs.readFileSync('files/'+key)):{};
  var v = dict[key] || content;
  const value = v.value || '';
  const destroy = v.destroy;
  const length= v.length || 0;
  const secret = v.secret || false;
  
  if (destroy){
    delete dict[key];
  }
  
  //console.log({value, length})

  // express helps us take JS objects and send them as JSON
  if (request.headers && request.headers["accept"] == "application/json") {
    return response.json({  value });
  }
  if (format=='json'){
    response.set({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json'
    })

    return response.send(value)
  }
  if (format){
    response.set({
      'Access-Control-Allow-Origin':'*'
    })
    return response.send(value);
  }
  if (!isHTML(request.headers)) {
    return response.send( value );
  }
  const headers =  JSON.stringify(request.headers)

  
  response.render('index', { key, value, headers, random, length, secret, URL })
});

var getFile = function(request){
  return request.file && request.file.buffer && request.file.buffer.toString();
}

app.post("/:key?", upload.single('value'),(request, response) => {
  var key = request.params.key ;
  var body = request.body || {};
  var value, destroy, lenght, secret;
  
  if (!key) key= body.key || haiku();

  value = request.rawBody || getFile(request) || body.value || '';
  destroy = body.destroy!=='false';
  secret = body.secret==='true';
  
  const length = value.length;
    
  var info = {destroy, value, length, secret, key};
  dict[key] = info;
  if (destroy===false ){
    fs.writeFileSync('files/'+key, JSON.stringify(info))
  }
  
  
  const href=URL+'/'+key;
  
  if (request.file || !acceptHTML(request)){
    response.set('Access-Control-Allow-Origin',' *');
    response.set('Content-type', 'application/octet-stream');
    return response.render('curl',{href});
  }
  
  return response.render('result', { key, href, URL })  
  
});


app.get('/.well-known/acme-challenge/:code', (req, res)=>{
  var code = req.params.code;
  console.log("acme-challgenge", code)
  if ('*'==ACME || code==ACME){
    res.send(code);
    return;
  }
  res.status(500);
  res.end();
})

// listen for requests :)
const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
