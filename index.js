const express = require('express'),
      compression = require('compression')

let app = express()
const http = require("http").createServer(app)
const routes = require("./routes/main")

// one month cache period for static files
let cacheTime = 30 * 24 * 60 * 60 * 1000
// compress app responses (before sending to client)
app.use(compression())
// use the 'public' directory to serve static files (and set cache time)
app.use(express.static(__dirname + "/public", {maxAge: cacheTime}))
// set express view engine to render Pug
app.set("view engine", "pug")

for (let pages in routes){
  app.use(pages, routes[pages])
}

http.listen(4000, () => {
  console.log("server is live on port 3030")
})
