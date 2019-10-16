const express = require("express"),
      router = express.Router(),
      bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get("/", (request, response) => {
  response.render("home", {title: "socketChat",
                      author: "Abdullah F. Khan",
                      description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan"})
})

router.post("/", (request, response) => {
  request.session = true;
  response.redirect("/")
  console.log(request.body.username)
  console.log(request.body.roomCode)
})

module.exports = router;
