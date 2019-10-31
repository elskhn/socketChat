const socket = io.connect()

document.addEventListener("DOMContentLoaded", function(event) {
  socket.emit('newUser')
  let userList = document.querySelector(".users-list"),
      chat = document.querySelector(".messages"),
      users = []
  socket.on("newUser", function (data) {
    users = data[0]
    if(users.length > 1) {
      document.querySelector(".alone-text").style.display = "none"
    }
    userList.innerHTML = ""
    sessionStorage.setItem("color", data[2])
    users.forEach((user, index) => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user.username))
      li.classList.add(user.color)
      userList.insertBefore(li, userList.firstChild)
    })
    
    // send message to others about who connected
    let notification = document.createElement("p")
    notification.innerHTML = `${users[users.length - 1].username} has <span>joined</span> the chat! <span class="emoji">👋</span>`
    notification.classList.add("notification")
    chat.appendChild(notification)
  })

  socket.on("userLeft", function (data) {
    userList.innerHTML = ""
    // send message to others about who disconnected
    let notification = document.createElement("p")
    notification.innerHTML = `${users[users.indexOf(users.find(user => user.id == data[1]))].username} has <span>left</span> the chat.`
    notification.classList.add("notification")
    chat.appendChild(notification)
    
    // remove user from the list
    users[users.indexOf(users.find(user => user.id == data[1]))] = null
    users = users.filter((element) => {
      return element != null
    })
    users.forEach((user, index) => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user.username))
      li.classList.add(user.color)
      userList.insertBefore(li, userList.firstChild)
    })
    if(users.length == 1) {
      document.querySelector(".alone-text").style.display = "block"
    }
  })
  let messageForm = document.querySelector(".messageForm"),
      messageInput = messageForm.querySelector(".message-input")

  messageForm.addEventListener("submit", function (event) {
    event.preventDefault()
    let error = document.querySelector(".error")
    error.style.display = "none"
    let message = messageInput.value.trim()
    if(message.length > 160) {
      error.style.display = "block"
      error.innerHTML = "Your message can't be longer than 160 characters. Sorry!"
      return;
    }
    if(message.length == 0) {
      error.style.display = "block"
      error.innerHTML = "You gotta type something first <span class=\"emoji\">😛</span>"
      return;
    }
    // let text = document.createElement("p")
    // text.innerHTML = message
    // text.classList.add("message", "mine", sessionStorage.getItem("color"))
    // chat.appendChild(text)
    // chat.scrollTop = chat.scrollHeight

    socket.emit("newMessage", messageInput.value.trim())
    messageForm.reset()

    if(document.querySelectorAll(".message").length > 0) {
      document.querySelector(".empty-notification").style.display = "none"
    }
  })
  socket.on("newMessage", function(data) {
    // console.log(data.username, data.message)
    let text = document.createElement("p")
    text.innerHTML = data.message
    text.classList.add("message", "not-mine", data.color)
    chat.appendChild(text)
    chat.scrollTop = chat.scrollHeight
  })
})
