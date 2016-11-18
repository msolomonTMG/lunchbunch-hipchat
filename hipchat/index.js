var hipchat = require('./hipchat')

module.exports = {
  sendRecommendation: hipchat.sendRecommendation,
  sendNoResults: hipchat.sendNoResults,
  sendHelp: hipchat.sendHelp
}
