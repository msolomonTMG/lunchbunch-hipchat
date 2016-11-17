'use strict';

const
  bodyParser = require('body-parser'),
  config = require('config'),
  express = require('express'),
  algolia = require('./algolia'),
  request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(express.static('public'));

// create application/json parser
var jsonParser = bodyParser.json()

app.post('/api/v1/webhook', jsonParser, function(req, res) {
  let room = req.body.item.room.id
  let query = req.body.item.message.message.split('/lunchbunch ')[1]

  algolia.search(query).then(venues => {
    let randomVenue = venues[Math.floor(Math.random() * venues.length)]
    hipchat.sendMessage(room, randomVenue).then(response => {
      res.sendStatus(200)
    }).catch(err => {
      res.sendStatus(500)
    })
  }).catch(err => {
    res.sendStatus(500)
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
