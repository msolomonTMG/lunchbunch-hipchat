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

app.post('/api/v1/webhook', function(req, res) {
  let room = request.body.item.room.id
  let query = request.body.item.message.message.split('/lunchbunch ')[1]

  algolia.search(query).then(venues => {
    let randomVenue = venues[Math.floor(Math.random() * venues.length)]
    hipchat.sendMessage(room, randomVenue);
  })

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
