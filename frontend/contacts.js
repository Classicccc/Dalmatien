
//request to add type=4
//type_request - type(0-block; 1-request, 2-friends)

let url = new URL(window.location.href)
const realUrl = url.protocol+"//"+url.host
let timerId
let last_id

loadContacts()

const butReq = document.querySelectorAll("#request-to-user button")[0]
butReq.onclick = async () =>
{
    login = document.getElementById("login-profile").textContent

    load(login)
}

async function load(login)
{
    const data = {
        type: 4,
        login1: localStorage.getItem("curLogin"),
        login2: login,
        type_request: 1
    }

    let resData = await newFetch(data)
    if (resData =="OK")
    {
        alert("Запрос отправлен")
    }
    else if (resData == "ERROR")
        alert("Непредвиденная ошибка")
    else alert(resData)
}

async function newFetch(data)
{   
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
        return resData
}

document.getElementById("backToContacts").onclick = () =>
{
    clearInterval(timerId)

    document.getElementsByClassName("user-messages")[0].style.zIndex = "0"
    document.getElementsByClassName("user-contacts")[0].style.zIndex = "1"

    document.getElementById("mBody").innerHTML = "Your messages are displayed here"
}

async function loadContacts()
{
    // 5
    data = {
        type: 5,
        login: localStorage.getItem("curLogin")
    }

    resData = await newFetch(data)
    
    for (let i = 0; i<resData.length; i++)
    {
        let contact = document.createElement("div")
        contact.className = "contact"
        if (resData[i].type == 2)
        {
            contact.onclick = async () =>
            {
                document.getElementsByClassName("user-messages")[0].style.zIndex = "1"
                document.getElementsByClassName("user-contacts")[0].style.zIndex = "0"
                document.getElementById("login-link").innerText = resData[i].login
                if (resData[i].photo)
                    document.getElementsByClassName("user-pic")[0].style.backgroundImage = "url("+ resData[i].photo +")"
                else  document.getElementsByClassName("user-pic")[0].style.backgroundImage = "url('img/img-profile.jpg')"
                
                //type 7 - get messages with userN
                dataMsg = {
                    type: 7,
                    id_contact: resData[i].id_contact
                }

                resMsg = await newFetch(dataMsg)

                let resMsg2
                timerId = setInterval(async () => {
                    last_id = resMsg.length-1
                    if (resMsg2!=undefined)
                        last_id = resMsg2.length-1
                    resMsg2 = await newFetch(dataMsg)
                    while (last_id < resMsg2.length-1)
                    {
                        last_id = last_id + 1
                        if (resMsg2[last_id].login_sender != localStorage.getItem("curLogin"))
                        {
                            let message = document.createElement("div")
                            message.innerText = resMsg2[last_id].message
                            message.className = "message"
                            message.style.backgroundColor = "rgb(235, 235, 235)"
                            message.style.alignSelf = "flex-start"
                            bodyMessage.appendChild(message)
                            
                            let message_date = document.createElement("div")
                            message_date.innerText = resMsg2[last_id].date
                            message_date.className = "message-date"
                            message.appendChild(message_date)

                            bodyMessage.scrollTop = bodyMessage.scrollHeight
                        }
                    }
                }, 5000);

                    for (let i = 0; i<resMsg.length; i++)
                    {
                        let message = document.createElement("div")
                        message.innerText = resMsg[i].message
                        message.className = "message"
                        if (resMsg[i].login_sender != localStorage.getItem("curLogin"))
                        {
                            message.style.backgroundColor = "rgb(235, 235, 235)"
                            message.style.alignSelf = "flex-start"
                        }
                        bodyMessage.appendChild(message)
                        
                        let message_date = document.createElement("div")
                        message_date.innerText = resMsg[i].date
                        message_date.className = "message-date"
                        message.appendChild(message_date)
                    }
                    
                    bodyMessage.scrollTop = bodyMessage.scrollHeight
            }
            
            document.getElementsByClassName("body-contacts")[0].appendChild(contact)
        }
        else 
        {
            contact.onclick = () =>
            {
                ans = confirm("Confirm request?")
                if (ans)
                {
                    load(resData[i].login)
                }
            }
            document.getElementsByClassName("body-contacts")[1].appendChild(contact)
        }

        let contactName = document.createElement("div")
        contactName.id = "contact-name"
        contactName.innerText = resData[i].name + " " + resData[i].surname
        contact.appendChild(contactName)

        let contactLogin = document.createElement("div")
        contactLogin.id = "contact-login"
        contactLogin.innerText = resData[i].login
        contactName.appendChild(contactLogin)

        let contactImg = document.createElement("div")
        contactImg.id = "contact-img"
        if (resData[i].photo)
            contactImg.style.backgroundImage = "url("+ resData[i].photo +")"

        contact.appendChild(contactImg)
    }
    // document.getElementById("contact-img").style.backgroundImage = "url("+ URL.createObjectURL(resDataPhotos[0]) +")"
    // console.log(resData)
    // console.log(await resDataPhotos.blob())  
}