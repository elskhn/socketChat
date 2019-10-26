const socket = io.connect()

document.addEventListener("DOMContentLoaded", function(event) {
  socket.emit('newUser')
  let userList = document.querySelector(".users-list")
  socket.on("newUser", function (data) {
    console.log(data.users.length)
    let users = data.users.filter(function(element) {
      return element != null
    })
    if(users.length > 1) {
      document.querySelector(".alone-text").style.display = "none"
    }
    users.forEach(user => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user))
      userList.insertBefore(li, userList.firstChild)
    })
    // for (let index = 0; index < data.users.length; index++) {
    //   let li = document.createElement("li")
    //   li.appendChild(document.createTextNode(data.users.username))
    //   userList.insertBefore(li, userList.firstChild)
    // }
  })

  socket.on("userLeft", function (data) {
    console.log(data);
    
  })
  let messageForm = document.querySelector(".messageForm"),
      messageInput = messageForm.querySelector(".message-input")

  messageForm.addEventListener("submit", function (event) {
    event.preventDefault()
    socket.emit("newMessage", messageInput.value.trim())
    messageForm.reset()
  })

  socket.on("newMessage", function(data) {
    console.log(data.username, data.message)
  })

})
