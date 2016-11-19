var hipchat = require('./hipchat')

module.exports = {
  askForLocation: hipchat.askForLocation,
  sendAddressSuccessMessage: hipchat.sendAddressSuccessMessage,
  sendRangeSuccessMessage: hipchat.sendRangeSuccessMessage,
  sendRecommendation: hipchat.sendRecommendation,
  sendNoResults: hipchat.sendNoResults,
  sendHelp: hipchat.sendHelp
}
