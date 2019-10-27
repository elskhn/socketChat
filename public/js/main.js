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
    users.forEach((user, index) => {
      let li = document.createElement("li")
      // li.appendChild(document.createTextNode(index == users ? `${user.username} (me)` : user.username))
      li.appendChild(document.createTextNode(user.username))
      // li.textContent = user.username

      userList.insertBefore(li, userList.firstChild)
    })
    // console.log(users)
    
    // send message to others about who connected
    let notification = document.createElement("p")
    notification.innerHTML = `${users[users.length - 1].username} has <span>joined</span> the chat! <span class="emoji">👋</span>`
    notification.classList.add("notification")
    chat.appendChild(notification)
  })

  socket.on("userLeft", function (data) {
    // let users = data[0]
    userList.innerHTML = ""
    // console.log(users)
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
    users.forEach(user => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user.username))
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
    
    let text = document.createElement("p")
    text.innerHTML = messageInput.value.trim()
    text.classList.add("message", "mine")
    chat.appendChild(text)
    chat.scrollTop = chat.scrollHeight

    socket.emit("newMessage", messageInput.value.trim())
    messageForm.reset()
  })
  socket.on("newMessage", function(data) {
    // console.log(data.username, data.message)
    let text = document.createElement("p")
    text.innerHTML = data.message
    text.classList.add("message", "not-mine")
    chat.appendChild(text)
    chat.scrollTop = chat.scrollHeight
  })
})
