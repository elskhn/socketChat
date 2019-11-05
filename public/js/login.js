document.addEventListener("DOMContentLoaded", function(event) { 
  let loginForm = document.querySelector(".login-form"),
      createForm = document.querySelector(".create-form"),
      roomForm = document.querySelector(".room-form")

  // valid username is < 13 chars and is a single word
  function isValidUsername(username) {
    return username.trim() != "" && username.trim().length <= 12 && username.trim().indexOf(' ') == -1
  }
  // synchronise all three username text fields
  let usernameInput = document.querySelectorAll(".usernameInput")
  for (const field of usernameInput) {
    field.onkeyup = function () {
      for (const input of usernameInput) {
        input.value = this.value
      }
    }
  }

  // join global room
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault()
    let username = loginForm.querySelector("input[name=\"username\"]").value
    let error = loginForm.querySelector(".error")
    if (isValidUsername(username)) {
      fetch("/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
          username
        })
      })
      .then((response) => response.text())
      .then((data) => {window.location = (JSON.parse(data).redirect)})
      .catch((err)=> {
        error.innerHTML = err
        error.style.display = "block"
      })
    }
    else {
      error.innerHTML = "Usernames must be less than 13 characters, no spaces"
      error.style.display = "block"
    }
  })

  // create private room
  createForm.addEventListener("submit", function (event) {
    event.preventDefault()
    let username = createForm.querySelector("input[name=\"username\"]").value
    let error = createForm.querySelector(".error")
    if (isValidUsername(username)) {
      fetch("/room/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
          username
        })
      })
      .then((response) => response.text())
      .then((data) => {window.location = (JSON.parse(data).redirect)})
      .catch((err)=> {
        error.innerHTML = err
        error.style.display = "block"
      })
    }
    else {
      error.innerHTML = "Usernames must be less than 13 characters, no spaces"
      error.style.display = "block"
    }
  })

  // join private room
  roomForm.addEventListener("submit", function (event) {
    event.preventDefault()
    let username = roomForm.querySelector("input[name=\"username\"]").value,
        roomCode = roomForm.querySelector("input[name=\"roomCode\"]").value
    let error = roomForm.querySelector(".error")
    if (isValidUsername(username)) {
      if(!(/^[a-zA-Z0-9]{3,5}$/).test(roomCode)) {
        error.innerHTML = "Room code must be 3 – 5 alphanumeric characters"
        error.style.display = "block"  
      }
      else {
        fetch(`/room/${roomCode}`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }, 
          body: JSON.stringify({
            username
          })
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Room doesn't exist")
          }
          return response.text()
        })
        .then((data) => {window.location = (JSON.parse(data).redirect)})
        .catch((err)=> {
          error.innerHTML = err
          error.style.display = "block"
        })
      }
    }
    else {
      error.innerHTML = "Usernames must be less than 13 characters, no spaces"
      error.style.display = "block"
    }
  })
})

let particlesJSON = {"particles":{"number":{"value":220,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"}},"opacity":{"value":0.2,"random":true,"anim":{"enable":true,"speed":1.04,"opacity_min":0.1,"sync":false}},"size":{"value":3.95,"random":true,"anim":{"enable":true,"speed":4.8,"size_min":2.4,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":1,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"bounce","bounce":true,"attract":{"enable":false,"rotateX":1184,"rotateY":3078}}},"retina_detect":true}

particlesJS("particles", particlesJSON , function() {
  console.log("particles.js config loaded")
})
