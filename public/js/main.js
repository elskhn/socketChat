// use WebSockets exclusively (no XHR)
const socket = io({transports: ['websocket'], upgrade: false})

function generateID() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
}
let userID = generateID()
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
    userList.innerText = ""
    sessionStorage.setItem("color", data[2])
    users.forEach((user, index) => {
      let li = document.createElement("li")
      li.appendChild(document.createTextNode(user.username))
      li.classList.add(user.color)
      userList.insertBefore(li, userList.firstChild)
    })
    
    // send message to others about who connected
		let notification = document.createElement("p")
		let newUsername = users[users.length - 1].username
		notification.innerHTML = `<span class="notif-username"></span> has <span>joined</span> the chat! <span class="emoji">👋</span>`
		notification.getElementsByClassName("notif-username")[0].textContent = newUsername
    notification.classList.add("notification")
    chat.appendChild(notification)
    chat.scrollTop = chat.scrollHeight
  })

  socket.on("userLeft", function (data) {
    userList.innerText = ""
    // send message to others about who disconnected
		let notification = document.createElement("p")
		let leavingUsername = users[users.indexOf(users.find(user => user.id == data[1]))].username;
		notification.innerHTML = `<span class="notif-username"></span> has <span>left</span> the chat`;
		notification.getElementsByClassName("notif-username")[0].textContent = leavingUsername;
    notification.classList.add("notification")
    chat.appendChild(notification)
    chat.scrollTop = chat.scrollHeight

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
      error.innerHTML = "Your message can't be longer than 160 characters"
      return
    }
    if(message.length == 0) {
      error.style.display = "block"
      error.innerHTML = "You gotta type something first <span class=\"emoji\">😛</span>"
      return
    }

    socket.emit("newMessage", {message: messageInput.value.trim(), id: userID})
    messageForm.reset()

    if(document.querySelectorAll(".message").length > 0) {
      document.querySelector(".empty-notification").style.display = "none"
    }
  })
  socket.on("newMessage", function(data) {
    let text = document.createElement("p")
    text.innerText = data.message
    
    if(data.id == userID) {
      text.classList.add("message", "mine", data.color)
    }
    else {
      text.classList.add("message", "not-mine", data.color)
    }
    chat.appendChild(text)
    chat.scrollTop = chat.scrollHeight
  })
})
