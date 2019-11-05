let home = require("./home"),
    login = require('./login'),
    room = require("./room")

module.exports = {
    "/": home,
    "/room": room["router"], 
    "/login" : login
}
