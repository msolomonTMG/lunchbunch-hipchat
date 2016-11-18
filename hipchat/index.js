var hipchat = require('./hipchat')

module.exports = {
  sendMessage: hipchat.sendMessage,
  sendNoResults: hipchat.sendNoResults,
  sendHelp: hipchat.sendHelp
}
