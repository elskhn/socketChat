const express = require("express"),
      router = express.Router(),
      bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

function isValidUsername(username) {
  return username.trim() != "" && username.trim().length <= 12 && username.trim().indexOf(' ') == -1
}

router.get("/", (request, response) => {
  response.render("home", {
                      username: request.session.username,
                      title: "socketChat",
                      author: "Abdullah F. Khan",
                      description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan"})
})

router.post("/", (request, response, next) => {
  
  if(isValidUsername(request.body.username)) {
    request.session.authenticated = true
    request.session.username = request.body.username
    response.send({redirect: "/"});
    // response.redirect("/")
    // console.log("POST-ed", request.body.username);
  }
  else {
    response.status(400)
  }
})

module.exports = router
