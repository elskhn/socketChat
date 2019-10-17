window.onload = function() {
  let loginForm = document.querySelector(".login-form"),
      roomForm = document.querySelector(".room-form"),
      createForm = document.querySelector(".create-form")

  // let usernameFieldLogin = loginForm.getElementsByTagName('input')[0],
  //     usernameFieldRoom = roomForm.getElementsByTagName('input')[0],
  //     usernameFieldCreate = createForm.getElementsByTagName('input')[0]

  function isValidUsername(username) {
    return username.trim() != "" && username.length <= 12
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

  // nvm (or do username validation and display error message)
  // join global room
  // loginForm.addEventListener("submit", function (data) {

  // }, false)

  // // join private room
  // roomForm.addEventListener("submit", function (data) {

  // }, false)

  // // create private room
  // createForm.addEventListener("submit", function (data) {
  //   // console.log(this.username.value)
  //   // console.log(isValidUsername(this.username.value))
  // }, false)
}
let particlesJSON = {"particles":{"number":{"value":220,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"}},"opacity":{"value":0.2,"random":true,"anim":{"enable":true,"speed":1.04,"opacity_min":0.1,"sync":false}},"size":{"value":3.95,"random":true,"anim":{"enable":true,"speed":4.8,"size_min":2.4,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":1,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"bounce","bounce":true,"attract":{"enable":false,"rotateX":1184,"rotateY":3078}}},"retina_detect":true}

particlesJS("particles", particlesJSON , function() {
  console.log("particles.js config loaded")
})
