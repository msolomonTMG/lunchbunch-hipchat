var hipchat = require('./hipchat')

module.exports = {
  askForLocation: hipchat.askForLocation,
  sendSuccessMessage: hipchat.sendSuccessMessage,
  sendRecommendation: hipchat.sendRecommendation,
  sendNoResults: hipchat.sendNoResults,
  sendHelp: hipchat.sendHelp
}
