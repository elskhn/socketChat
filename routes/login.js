const express = require("express"),
      router = express.Router()

router.get("/", (request, response) => {
  response.render("login", {title: "Login | socketChat",
                      author: "Abdullah F. Khan",
                      description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan"});
});

module.exports = router;
