var hipchat = require('./hipchat')

module.exports = {
  askForLocation: hipchat.askForLocation,
  sendAddressSuccessMessage: hipchat.sendAddressSuccessMessage,
  sendRecommendation: hipchat.sendRecommendation,
  sendNoResults: hipchat.sendNoResults,
  sendHelp: hipchat.sendHelp
}
