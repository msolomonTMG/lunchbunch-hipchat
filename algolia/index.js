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
  algoliaHelper = algoliasearchHelper(algolia, 'thrillist-venues', {
    facets: ['node_type', 'is_promoted']
  });

var functions = {
  search: function(query) {
    return new Promise(function(resolve, reject) {
      query = ''
      algoliaHelper.addFacetRefinement('is_promoted', 'true');
      algoliaHelper.addFacetRefinement('node_type', 'venue');
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
