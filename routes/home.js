const express = require("express"),
      router = express.Router()

router.get("/", (request, response) => {
  response.render("home", {title: "socketChat",
                      author: "Abdullah F. Khan",
                      description: "Welcome to socketChat, a secure messaging application created by Abdullah Khan"});
});

module.exports = router;
