

// Search variables
var
  algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_PARAMS),
  algoliaHelper = algoliasearchHelper(algolia, 'thrillist-venues', {
    facets: ['node_type', 'is_promoted']
  });

var functions = {
  /*
  {
    "color": "green",
    "message": "It's going to be sunny tomorrow! (yey)",
    "notify": false,
    "message_format": "text"
  }
  */
  buildResponse: function(venue) {
    return new Promise(function(resolve, reject) {
      let response = {
        "color": "green",
        "message": "It's going to be sunny tomorrow! (yey)",
        "notify": false,
        "message_format": "text"
      }
      return resolve(response)
    })
  }
}

module.exports = functions;
