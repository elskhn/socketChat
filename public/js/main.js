const socket = io.connect()

document.addEventListener("DOMContentLoaded", function(event) {
  socket.emit('newUser')
  let userList = document.querySelector(".users-list")
  socket.on("newUser", function (users) {
    if(users.length > 1) {
      document.querySelector(".alone-text").style.display = "none"
    }
    userList.innerHTML = ""
    users.forEach(user => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user.username))
      li.textContent = user.username

      userList.insertBefore(li, userList.firstChild)
    })
    console.log(users)
    
    // send message to others about who connected
  })

  socket.on("userLeft", function (users) {
    if(users.length == 1) {
      document.querySelector(".alone-text").style.display = "block"
    }
    userList.innerHTML = ""
    users.forEach(user => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user.username))
      userList.insertBefore(li, userList.firstChild)
    })
    console.log(users)
    // send message to others about who disconnected
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
