'use strict';

const stamplay = require('../stamplay')
const request = require('request');

const HIPCHAT_AUTH_TOKEN = (process.env.HIPCHAT_AUTH_TOKEN) ?
  (process.env.HIPCHAT_AUTH_TOKEN) :
  config.get('hipchatAuthToken');

var helpers = {
  getHipchAuthToken: function(roomNumber) {
    return new Promise(function(resolve, reject) {
      stamplay.getRoom(roomNumber).then(room => {
        return resolve(room.accessToken)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  getCardText: function(venue) {
    let cardText;
    if (!venue.summary) {
      cardText = venue.description
    } else {
      cardText = venue.summary
    }
    if (cardText.length > 500) {
      cardText = cardText.substring(0,500);
    }
    return cardText
  },
  buildCard: function(venue) {
    let cardText = helpers.getCardText(venue)
    return {
      "style": "link",
      "id": "1",
      "url": "https://www.thrillist.com/" + venue.url,
      "title": venue.title,
      "description": cardText,
      "html": "test",
      "icon": {
        "url": "https://www.thrillist.com/images/thrillist/logos/Thrillist_Icon_Red.svg"
      },
      "date": 1453867674631,
      "thumbnail": {
        "url": "http://assets3.thrillist.com/v1/image/" + venue.image
      }
    }
  },
  sendMessage: function(room, message) {
    return new Promise(function(resolve, reject) {
      helpers.getHipchAuthToken(room).then(hipchatAuthToken => {
        let url = `https://thrillistmediagroup.hipchat.com/v2/room/${room}/notification?auth_token=${hipchatAuthToken}`
        request.post(
          url,
          { json: message },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              return resolve(body)
            } else {
              return reject(response)
            }
          }
        );
      })
    })
  }

}

var functions = {
  askForLocation: function(room) {
    return new Promise(function(resolve, reject) {
      let message = {
        "color": "yellow",
        "message": "Enter your address like this '/lunchbunch --address your address here' and I'll search for places near you.",
        "notify": false,
        "message_format": "text"
      }
      helpers.sendMessage(room, message).then(response => {
        return resolve(response)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  sendSuccessMessage: function(room, type) {
    return new Promise(function(resolve, reject) {
      let text;
      switch(type) {
        case 'address':
          text = "Your address has been saved! Go ahead and ask for some random places near you using '/lunchbunch' or look for specific places like this: '/lunchbunch pizza'. You can always update your address by using '/lunchbunch --address your address here'"
        break;
        case 'range':
          text = "The range for this room has been set! You can always update it by using '/lunchbunch --range number of miles here'"
        break;
      }
      let message = {
        "color": "green",
        "message": text,
        "notify": false,
        "message_format": "text"
      }
      helpers.sendMessage(room, message).then(success => {
        return resolve(sucess)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  sendRecommendation: function(room, venue) {
    return new Promise(function(resolve, reject) {

      let card = helpers.buildCard(venue)

      let message = {
        "color": "gray",
        "message": "It's going to be sunny tomorrow! (yey)",
        "notify": false,
        "message_format": "text",
        "card": card
      }

      helpers.sendMessage(room, message).then(success => {
        return resolve(success)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  sendNoResults: function(room) {
    return new Promise(function(resolve, reject) {
      let message = {
        "color": "red",
        "message": "I couldn't find any good spots. Try looking for something else or try expanding your range by using '/lunchbunch --range number of miles'.",
        "notify": false,
        "message_format": "text"
      }

      helpers.sendMessage(room, message).then(success => {
        return resolve(success)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  sendHelp: function(roomSettings) {
    return new Promise(function(resolve, reject) {
      let message = {
        color: "gray",
        message: "Here are some tips for using lunchbunch:\
        <table>\
          <tr><th>Command</th><th>Result</th></tr>\
          <tr><td>/lunchbunch</td><td>search for a random place</td></tr>\
          <tr><td>/lunchbunch <em>search term</em></td><td>search for something</td></tr>\
          <tr><td>/lunchbunch --address <em>address</em></td><td>set the address for this room. I'll look for places around here</td></tr>\
          <tr><td>/lunchbunch --range <em>number of miles</em></td><td>limit how far you're willing to go for food by entering the number of miles here. I'll only recommend places that are within this limit. I default to 1 mile.</td></tr>\
          <tr><td>/lunchbunch --help</td><td>bring up this menu</td></tr>\
        </table>",
        notify: false,
        message_format: "html"
      }

      if (roomSettings.address) {
        message.message += `The address for this room is currently set to ${roomSettings.address}`
      }

      helpers.sendMessage(roomSettings.number, message).then(success => {
        return resolve(success)
      }).catch(err => {
        return reject(err)
      })
    })
  }
}

module.exports = functions;
