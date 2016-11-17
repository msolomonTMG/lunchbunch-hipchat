'use strict';

const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  algolia = require('./algolia'),
  https = require('https'),
  request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.post('/api/v1/webhook', function(req, res) {

  let query = request.body.item.message.message.split('/lunchbunch ')[1]

  algolia.search(query).then(venues => {

    let randomVenue = venues[Math.floor(Math.random() * venues.length)]

    hipchat.buildResponse(randomVenue).then(response => {
      response.end(json);
    })

  })

});
