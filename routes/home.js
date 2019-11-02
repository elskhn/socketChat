const express = require("express"),
      router = express.Router(),
      bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

function isValidUsername(username) {
  return username.trim() != "" && username.trim().length <= 12 && username.trim().indexOf(' ') == -1
}

router.get("/", (request, response) => {
  if(request.session.roomID.toLowerCase() !== "global") {
    response.redirect(`/room/${request.session.roomID}`)  
  }
  else {
    response.render("home", {
                        username: request.session.username,
                        room: "Global",
                        title: `socketChat`,
                        author: "Abdullah F. Khan",
                        description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan",
                        aloneMessage: "You're all alone in here <span class=\"emoji\">🙁</span>"
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
    request.session.roomID = "global"
    counter++
    response.send({redirect: "/"})
  }
  else {
    response.status(400)
  }
})

module.exports = router
