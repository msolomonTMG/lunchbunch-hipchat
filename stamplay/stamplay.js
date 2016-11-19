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
              let address = data.results[0].formatted_address
              let result = {
                coordinates: coordinates,
                address: address
              }
              return resolve(result)
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
        if (!err) {
          return resolve(res)
        } else {
          return reject(err)
        }
      })
    })
  },
  getRoom: function(roomNumber) {
    return new Promise(function(resolve, reject) {
      stamplay.Object('room').get({ number: roomNumber }, function(err, res) {
        if (!err) {
          let firstResult = res.data[0]
          return resolve(firstResult)
        } else {
          return reject(err)
        }
      })
    })
  },
  setRoomLocation: function(room, address) {
    return new Promise(function(resolve, reject) {
      helpers.geocode(address).then(geocodedAddress => {
        let data = {
          _geolocation: {
            type: "Point",
            coordinates: geocodedAddress.coordinates
          },
          address: geocodedAddress.address
        }
        stamplay.Object('room').patch(room._id, data, function(err, res) {
          if (!err) {
            return resolve(res)
          } else {
            return reject(err)
          }
        })
      })
    })
  },
  setRoomRange: function(room, range) {
    return new Promise(function(resolve, reject) {
      stamplay.Object('room').patch(room._id, { search_radius: range }, function(err, res) {
        if (!err) {
          return resolve(res)
        } else {
          return reject(err)
        }
      })
    })
  }
}

module.exports = functions;
