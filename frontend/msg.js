
const buttonMessage = document.getElementById('icon_mes')
const bodyMessage = document.getElementById('mBody')
let message = document.getElementById("input-message")
async function new_msg(msg)
{
    let msg_value = msg.value

    if (msg_value.length>1600)
        alert("Максимальная длина сообщений 1600 символов")
    else if (msg_value.length>0)
    {
        let d = new Date()
        let mins = d.getMinutes()
        if (mins<10)
            mins = "0"+mins
        let cur_date = d.getHours()+":"+mins+" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear()
       
        let message = document.createElement("div")
        message.innerText = msg_value
        message.className = "message"
        bodyMessage.appendChild(message)
        
        let message_date = document.createElement("div")
        message_date.innerText = cur_date
        message_date.className = "message-date"
        message.appendChild(message_date)

        //send to server
        //type: 2-message
        const data = {
            type: 2,
            message : msg_value,
            date : cur_date,
            login_sender: localStorage.getItem("curLogin"),
            login_getter: document.getElementById("login-link").innerText
        }

        res = await fetch(realUrl, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        //responce from server "resData"
            let resData
            if (res.ok) {
                resData = await res.json();
            } else {
                alert("Ошибка HTTP: " + res.status);
            }
            if (resData == "ERROR")
                alert("Error with sending message to user")

    }
    bodyMessage.scrollTop = bodyMessage.scrollHeight
    msg.value = ""
}


buttonMessage.onclick = () => {
    new_msg(message)
    // fetch('https://api.github.com/users/fabpot')
    // .then(res => res.json())
    // .then(json => console.log(json));
}

message.addEventListener('keydown', function(e) {
    if (e.keyCode == 13){
        buttonMessage.onclick()
    }
})
