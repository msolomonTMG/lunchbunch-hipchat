'use strict';

var Stamplay = require('stamplay')
const request = require('request')

const STAMPLAY_APP_ID = process.env.STAMPLAY_APP_ID
const STAMPLAY_API_KEY = process.env.STAMPLAY_API_KEY
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

var stamplay = new Stamplay(STAMPLAY_APP_ID, STAMPLAY_API_KEY)

var helpers = {
  geocode: function(address) {
    let urlEncodedAddress = encodeURIComponent(address)
    return new Promise(function(resolve, reject) {
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${urlEncodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
      request.get(
        url,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            let data = JSON.parse(body)
            if (data.results[0].geometry.location) {
              let coordinates = [
                data.results[0].geometry.location.lat,
                data.results[0].geometry.location.lng
              ]
              return resolve(coordinates)
            } else {
              return reject(response)
            }
          } else {
            return reject(response)
          }
        }
      );
    })
  }
}

var functions = {
  addRoom: function(roomNumber) {
    return new Promise(function(resolve, reject) {
      stamplay.Object('room').save({ number: roomNumber }, function(err, res) {
        return resolve(res)
      })
    })
  },
  getRoom: function(roomNumber) {
    return new Promise(function(resolve, reject) {
      stamplay.Object('room').get({ number: roomNumber }, function(err, res) {
        let firstResult = res.data[0]
        return resolve(firstResult)
      })
    })
  },
  setRoomLocation: function(room, address) {
    return new Promise(function(resolve, reject) {
      helpers.geocode(address).then(geocodedAddress => {
        let data = {
          _geolocation: {
            type: "Point",
            coordinates: geocodedAddress
          }
        }
        stamplay.Object('room').patch(room._id, data, function(err, res) {
          console.log(res)
          return resolve(res)
        })
      })
    })
  }
}

module.exports = functions;
