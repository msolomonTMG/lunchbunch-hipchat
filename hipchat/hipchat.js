const request = require('request');

const HIPCHAT_AUTH_TOKEN = (process.env.HIPCHAT_AUTH_TOKEN) ?
  (process.env.HIPCHAT_AUTH_TOKEN) :
  config.get('hipchatAuthToken');

var helpers = {
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
      let url = `https://thrillistmediagroup.hipchat.com/v2/room/${room}/notification?auth_token=${HIPCHAT_AUTH_TOKEN}`
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
  }

}

var functions = {
  sendMessage: function(room, venue) {
    return new Promise(function(resolve, reject) {

      let card = helpers.buildCard(venue)

      let message = {
        "color": "green",
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
        "message": "I couldn't find any good spots. Try looking for something else.",
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
  sendHelp: function(room) {
    return new Promise(function(resolve, reject) {
      let message = {
        "color": "yellow",
        "message": "Here are some tips for using lunchbunch:\
        <table>\
          <tr><th>Command</th><th>Result</th></tr>\
          <tr><td>/lunchbunch</td><td>search for a random place</td></tr>\
          <tr><td>/lunchbunch <em>search term</em></td><td>search for something</td></tr>\
          <tr><td>/lunchbunch --address <em>address</em></td><td>set the address for this room. I'll look for places around here</td></tr>\
          <tr><td>/lunchbunch --help</td><td>bring up this menu</td></tr>\
        </table>",
        "notify": false,
        "message_format": "html"
      }

      helpers.sendMessage(room, message).then(success => {
        return resolve(success)
      }).catch(err => {
        return reject(err)
      })
    })
  }
}

module.exports = functions;
