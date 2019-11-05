const express = require("express"),
      router = express.Router(),
      bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
let rooms = []

function isValidUsername(username) {
  return username.trim() != "" && username.trim().length <= 12 && username.trim().indexOf(' ') == -1
}

function generateRoomID() {
  return Math.random().toString(36).substr(5, 5).toUpperCase()
}

router.get("/", (request, response) => {
  if(request.session.authenticated) {
    rooms = [...new Set(rooms.filter((room) => { room != null}))]
    if(request.session.roomID && request.session.roomID !== "global") {
      response.redirect(`/room/${request.session.roomID}`) 
    }
    else if(request.session.roomID && request.session.roomID == "global") {
      response.redirect(`/`)
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
  if (request.params.roomID == "global") {
    response.redirect("/")
  }
  else {
    rooms.push(request.params.roomID)
    response.render("home", {
                        username: request.session.username,
                        room : `${request.params.roomID}`,
                        title: `socketChat – ${request.params.roomID}`,
                        author: "Abdullah F. Khan",
                        description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan",
                        aloneMessage: "Invite people with the code above <span class=\"emoji\">✅</span>"
                      })
  }
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

  rooms = [...new Set(rooms.filter((room) => { room != null}))]
})

router.post("/:roomCode", (request, response, next) => {
  if(isValidUsername(request.body.username) && (/^[a-zA-Z0-9]{3,5}$/).test(request.params.roomCode) && rooms.indexOf(request.params.roomCode) != -1) {
    counter = counter >= colors.length ? 0 : counter
    request.session.authenticated = true
    request.session.color = colors[counter]
    request.session.username = request.body.username
    request.session.roomID = request.params.roomCode
    counter++
    response.send({redirect: `/room/${request.params.roomCode}`})
  }
  else {
    response.status(400).json("invalid username/code or room doesn't exist")
  }
  rooms = [...new Set(rooms.filter((room) => { room != null}))]
})

module.exports = {router, destroyRoom: (room) => { rooms[rooms.indexOf(room)] = null }}
