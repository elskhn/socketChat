const express = require("express"),
      router = express.Router(),
      bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

function isValidUsername(username) {
  return username.trim() != "" && username.trim().length <= 12 && username.trim().indexOf(' ') == -1
}

function generateRoomID() {
  return Math.random().toString(36).substr(5, 5).toUpperCase()
}

router.get("/", (request, response) => {
  if(request.session.authenticated) {
    if(request.session.roomID) {
      response.redirect(`/room/${request.session.roomID}`)  
    }
    else {
      request.session.roomID = generateRoomID()
      response.redirect(`/room/${request.session.roomID}`)
    }
  }
  else {
    response.redirect(`/login`)
  }
})

router.get("/:roomID", (request, response) => {
  response.render("home", {
                      username: request.session.username,
                      title: `socketChat - ${request.params.roomID}`,
                      author: "Abdullah F. Khan",
                      description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan"})
})

let colors = ["purple", "pink", "orange", "green", "blue", "red", "white", "yellow"],
    counter = 0

router.post("/", (request, response, next) => {
  
  if(isValidUsername(request.body.username)) {
    counter = counter >= colors.length ? 0 : counter
    request.session.authenticated = true
    request.session.color = colors[counter]
    request.session.username = request.body.username
    counter++
    response.send({redirect: "/room"})
  }
  else {
    response.status(400)
  }
})

module.exports = router
