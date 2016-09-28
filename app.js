// *** main dependencies *** //
var express = require('express');
var path = require('path');
var swig = require('swig');
var request = require('request');
var geoip = require('geoip-lite');
var bodyParser = require('body-parser')


// *** express instance *** //
var app = express();

// *** view engine *** //
var swig = new swig.Swig();
var data;
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('trust_proxy', 1)

// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// *** main routes *** //
app.post('/index', function(req, res) {
  console.log("reached");
   //***get data from api***//
  request({
    url: 'http://api.openweathermap.org/data/2.5/forecast/daily',
    qs:{lon: req.body.location.longitude,
    lat: req.body.location.latitude,
    cnt:'16',
    APPID: '3bc0dd0cbbd8de0241d0349f2480b9f8'},
    method:'GET',
    
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonContent = JSON.parse(body);
      res.send(jsonContent);
    }else{
      console.log(error)
    }
  })

});

// entry point for the single page
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// *** create server *** // 
var server = app.listen(3000, function() {
  console.log('Express server listening on port ' + server.address().port);
});

