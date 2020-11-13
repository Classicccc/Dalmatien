const loginButton = document.getElementById("button-login")
const goingRegButton = document.getElementById("button-going-reg")
const registerButton = document.getElementById("button-register")
const okayButton = document.getElementById("button-okay")
const goingLoginButton = document.getElementById("button-going-login")

const loginBody = document.getElementById("login-form")
const registerBody = document.getElementById("register-form")
const okayBody = document.getElementById("okay-form")
const mainBody = document.getElementsByTagName("body")[0]

const loginInput = document.getElementsByClassName("input-data")[0]
const pasInput = document.getElementsByClassName("input-data")[1]

//http://localhost:3000
let url = new URL(window.location.href)
const realUrl = url.protocol+"//"+url.host

mainBody.style.background = "linear-gradient(45deg, white, rgb("+rnd(100, 150)+", "+rnd(150, 200)+", "+rnd(150, 200)+"))"

document.getElementsByTagName("body")[0].scrollLeft = 0

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}

goingLoginButton.onclick = () => {
    move(loginBody, "-100", "0")
    move(registerBody, "-100", "0")
}

goingRegButton.onclick = () => {
    move(loginBody, "0", "-100")
    move(registerBody, "0", "-100")
}

var isCyrillic = function (text) {
    return /[а-я]/i.test(text);
}

async function newFetch(url, data)
{
    res = await fetch(url, {
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

pasInput.addEventListener('keydown', function(e){
    if (e.keyCode == 13)
        loginButton.onclick()
})


loginButton.onclick = async (event) => {
    const data = {
        type: 0,
        login: loginInput.value,
        password: pasInput.value
    }
    if (data.login == "" || data.password == "")
        alert("Fill in all fields")
    else
    {
        resData = await newFetch(realUrl, data)
        
        if (resData.code == "OK")
        {   
            localStorage.setItem("curLogin", resData.login)
            document.location.href = ("index.html")
            // document.getElementById("username-profile").innerText = "resData.login"
        }
        else 
            alert(resData)
    }

}

registerButton.onclick = async () => {
    if (document.getElementsByClassName("input-data")[3].value != document.getElementsByClassName("input-data")[4].value)
        alert("Wrong confirm password")
    else
    {
        const data = {
            type: 1,
            login: document.getElementsByClassName("input-data")[2].value,
            password: document.getElementsByClassName("input-data")[3].value,
            name: document.getElementsByClassName("input-data")[5].value,
            surname: document.getElementsByClassName("input-data")[6].value,
            age: document.getElementsByClassName("input-data")[7].value,
            city: document.getElementsByClassName("input-data")[8].value
        }
        if (data.login == "" || data.password == "" || data.name == "" || data.surname == "" || data.age == "" || data.city == "")
            alert("Fill in all fields")
        else
        {
            resData = await newFetch(realUrl, data)
            
            if (resData == "OK")
            {
                localStorage.setItem("curLogin", data.login)
                contactYourSelf()
                document.location.href = ("index.html")
            }
            else 
                alert(resData)
        }
    }
}

contactYourSelf = async () =>
{
    const data = {
        type: 4,
        login1: localStorage.getItem("curLogin"),
        login2: localStorage.getItem("curLogin"),
        type_request: 2
    }

    let resData = await newFetch(realUrl, data)
    if (resData =="OK")
        alert("Запрос отправлен")
    else if (resData == "ERROR")
        alert("Непредвиденная ошибка")
}


okayButton.onclick = () => {
    document.location.href = ("index.html")
}

function move(body, translate1, translate2)
{
    let anime = body.animate([
        {
            transform: 'translate('+translate1+'%)',
        },
        {
            transform: 'translate('+translate2+'%)',
        }
    ], {
        duration: 1000,
        easing: "ease"
    })
    anime.addEventListener('finish', function() {
        body.style.transform = 'translate('+translate2+'%)'
    });
}
