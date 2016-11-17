const request = require('request');

const HIPCHAT_AUTH_TOKEN = (process.env.HIPCHAT_AUTH_TOKEN) ?
  (process.env.HIPCHAT_AUTH_TOKEN) :
  config.get('hipchatAuthToken');

var functions = {
  /*
  {
    "color": "green",
    "message": "It's going to be sunny tomorrow! (yey)",
    "notify": false,
    "message_format": "text"
  }
  */
  sendMessage: function(room, venue) {
    return new Promise(function(resolve, reject) {
      console.log('sending message to room')
      console.log(room)
      let message = {
        "color": "green",
        "message": "It's going to be sunny tomorrow! (yey)",
        "notify": false,
        "message_format": "text"
      }
      let url = `https://thrillistmediagroup.hipchat.com/v2/room/${room}/notification?auth_token=${HIPCHAT_AUTH_TOKEN}`
      request.post(
        url,
        { json: message },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body)
            return resolve(body)
          } else {
            return reject(error)
          }
        }
      );
    })
  }
}

module.exports = functions;
