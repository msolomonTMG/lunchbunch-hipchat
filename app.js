'use strict';

const
  bodyParser = require('body-parser'),
  config = require('config'),
  express = require('express'),
  algolia = require('./algolia'),
  hipchat = require('./hipchat'),
  request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/v1/webhook', function(req, res) {
  let room = req.body.item.room.id
  let command = req.body.item.message.message
  //TODO: this should be regex testing
  switch(command) {
    case '/lunchbunch --help':
      showHelp(room);
    break;
    case '/lunchbunch --address':
      setAddress(room, parameter);
    break;
    default:
      let query = req.body.item.message.message.split('/lunchbunch ')[1]
      search(room, query);
    break;
  }

  function search(room, query) {
    algolia.search(query).then(venues => {
      if (venues.length === 0) {
        hipchat.sendNoResults(room).then(response => {
          res.sendStatus(200)
        }).catch(err => {
          res.sendStatus(500)
        })
      } else {
        let randomVenue = venues[Math.floor(Math.random() * venues.length)]
        hipchat.sendRecommendation(room, randomVenue).then(response => {
          res.sendStatus(200)
        }).catch(err => {
          res.send(err)
        })
      }
    }).catch(err => {
      res.sendStatus(500)
    })
  }

  function showHelp(room) {
    hipchat.sendHelp(room).then(response => {
      res.sendStatus(200)
    }).catch(err => {
      res.sendStatus(500)
    })
  }

  function setAddress(room, address) {

  }

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
