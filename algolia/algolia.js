'use strict';

const
  algoliasearch = require('algoliasearch'),
  algoliasearchHelper = require('algoliasearch-helper'),
  config = require('config')

const ALGOLIA_APP_ID = (process.env.ALGOLIA_APP_ID) ?
  (process.env.ALGOLIA_APP_ID) :
  config.get('algoliaAppId');

const ALGOLIA_API_KEY = (process.env.ALGOLIA_API_KEY) ?
  (process.env.ALGOLIA_API_KEY) :
  config.get('algoliaApiKey');

// Search variables
var
  algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY),
  algoliaHelper = algoliasearchHelper(algolia, 'thrillist_venue', {
    facets: ['node_type', 'is_promoted', 'is_open']
  });

algoliaHelper.addFacetRefinement('is_promoted', 'true');
algoliaHelper.addFacetRefinement('node_type', 'venue');
algoliaHelper.addFacetRefinement('is_open', 1);

var functions = {
  search: function(roomSettings, query) {
    return new Promise(function(resolve, reject) {
      let lat = roomSettings._geolocation.coordinates[0]
      let lng = roomSettings._geolocation.coordinates[1]
      let coordinates = `${lat}, ${lng}`

      let searchRadius = 1609 //default to 1 mile or 1.609km
      if (roomSettings.search_radius) {
        searchRadius = roomSettings.search_radius
      }

      algoliaHelper.setQueryParameter('aroundLatLng', coordinates);
      algoliaHelper.setQueryParameter('aroundRadius', searchRadius);
      algoliaHelper.setQuery(query).search();
      algoliaHelper.on('result', function(content) {
        return resolve(content.hits);
       });
      algoliaHelper.on('error', function (error) {
        return reject(error);
      });
    })
  }
}

module.exports = functions;
