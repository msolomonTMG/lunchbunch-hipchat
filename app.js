'use strict';

const
  bodyParser = require('body-parser'),
  config = require('config'),
  express = require('express'),
  algolia = require('./algolia'),
  hipchat = require('./hipchat'),
  request = require('request'),
  stamplay = require('./stamplay'),
  capabilities = require('./capabilities.json');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/api/v1/capabilities', function(req, res) {
  res.json(capabilities)
})

app.get('/configuration', function(req, res) {
  res.sendfile('./configuration.html');
})

function parseCommand(message) {
  if (message.match(/--address/)) {
    return 'address'
  } else if (message.match(/--help/)) {
    return 'help'
  } else if (message.match(/--range/)) {
    return 'range'
  } else {
    return 'search'
  }
}

app.post('/api/v1/webhook', function(req, res) {
  let room = req.body.item.room.id
  let message = req.body.item.message.message
  let command = parseCommand(message)

  switch(command) {
    case 'help':
      showHelp(room);
    break;
    case 'address':
      let address = message.split('--address ')[1]
      setAddress(room, address)
    break;
    case 'range':
      let range = message.split('--range ')[1]
      setRange(room, range)
    break;
    default:
      let query = req.body.item.message.message.split('/lunchbunch ')[1]
      getRoomSettings(room).then(roomSettings => {
        if (!roomSettings._geolocation) {
          hipchat.askForLocation(room).then(response => {
            res.sendStatus(200)
          }).catch(err => {
            res.sendStatus(500)
          })
        } else {
          search(roomSettings, query)
        }
      })
    break;
  }

  // get room settings from stamplay. create room if it does not exist
  function getRoomSettings(roomNumber) {
    return new Promise(function(resolve, reject) {
      stamplay.getRoom(roomNumber).then(roomSettings => {
        if (!roomSettings) {
          stamplay.addRoom(room).then(roomSettings => {
            return resolve(roomSettings)
          }).catch(err => {
            return reject(err)
          })
        } else{
          return resolve(roomSettings)
        }
      }).catch(err => {
        return reject(err)
      })
    })
  }

  function search(roomSettings, query) {
    algolia.search(roomSettings, query).then(venues => {
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
    getRoomSettings(room).then(roomSettings => {
      hipchat.sendHelp(roomSettings).then(response => {
        res.sendStatus(200)
      }).catch(err => {
        res.sendStatus(500)
      })
    })
  }

  function setAddress(room, address) {
    getRoomSettings(room).then(roomSettings => {
      stamplay.setRoomLocation(roomSettings, address).then(response => {
        hipchat.sendSuccessMessage(room, 'address').then(success => {
          res.sendStatus(200)
        }).catch(err => {
          res.sendStatus(500)
        })
      })
    }).catch(err => {
      res.sendStatus(500)
    })
  }

  function setRange(room, range) {
    let rangeInt = parseInt(range)
    let rangeInMiles = rangeInt * 1609.34 // convert miles to meters

    getRoomSettings(room).then(roomSettings => {
      stamplay.setRoomRange(roomSettings, rangeInMiles).then(response => {
        hipchat.sendSuccessMessage(room, 'range').then(success => {
          res.sendStatus(200)
        }).catch(err => {
          res.sendStatus(500)
        })
      }).catch(err => {
        res.sendStatus(500)
      })
    })
  }

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
