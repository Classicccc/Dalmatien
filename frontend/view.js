
const buttonMenuProfile = document.getElementsByClassName("menu")[0]
const profileBody = document.getElementsByClassName("main-profile")[0]

const buttonMenuMessage = document.getElementsByClassName("menu")[1]
const messageBody = document.getElementsByClassName("main-message")[0]

const buttonMenuPictures = document.getElementsByClassName("menu")[2]
const picturesBody = document.getElementsByClassName("main-pictures")[0]

const buttonSplit = document.getElementById("button-split")

const audio = document.getElementById("audio_bang")
const dalmatien = document.getElementById("dalmatien")
audio.volume = 0.05

profileBody.style.zIndex = 2
messageBody.style.zIndex = 1
picturesBody.style.zIndex = 0

let firstTime = true

function swap(body1, body2)
{
    if (buttonSplit.innerText == "Collect")
    {
        if (body2.style.zIndex == "0")
        {
            move(body1, 1, 0, 0.8, -120)
            move(body2, 0.8, -120, 1, 0)
        }
        else
        {
            move(body1, 1, 0, 0.8, 120)
            move(body2, 0.8, 120, 1, 0)
        }
    }
    body1.style.zIndex = [body2.style.zIndex, body2.style.zIndex = body1.style.zIndex][0]
}

function move(body, scale1, translate1, scale2, translate2)
{
    let anime = body.animate([
        {
            transform: 'scale('+scale1+') translate('+translate1+'%)',
        },
        {
            transform: 'scale('+scale2+') translate('+translate2+'%)',
        }
    ], {
        duration: 1000,
        easing: "ease"
    })
    anime.addEventListener('finish', function() {
        body.style.transform = 'scale('+scale2+') translate('+translate2+'%)'
    });
}

function move_body(body0, body1, button)
{
    if (button.innerText == "Split")
    {
        if (firstTime)
        {
            loadPosts()
            firstTime = false
        }
        move(body0, 1, 0, 0.8, -120)
        move(body1, 1, 0, 0.8, 120)
        button.innerText = "Collect"
    }
    else
    {
        move(body0, 0.8, -120, 1, 0)
        move(body1, 0.8, 120, 1, 0)
        button.innerText = "Split"
    }
}

buttonSplit.onclick = () =>{
    // let left = 0
    // let timer = setInterval(() => {
        
    //     console.log(window.getComputedStyle(messageBody).marginLeft)

    //     messageBody.style.marginLeft = "calc("+window.getComputedStyle(messageBody).marginLeft+" - "+left+"px)"

    //     if (window.getComputedStyle(messageBody).marginLeft[0] == "-")
    //         clearInterval(timer)
    //     left+=0.05
    // }, 1)


    if (profileBody.style.zIndex == "2")
        if (messageBody.style.zIndex == "0")
            move_body(messageBody, picturesBody, buttonSplit)
        else
            move_body(picturesBody, messageBody, buttonSplit)
    else if (messageBody.style.zIndex == "2")
        if (profileBody.style.zIndex == "0")
            move_body(profileBody, picturesBody, buttonSplit)
        else
            move_body(picturesBody, profileBody, buttonSplit)
    else
        if (messageBody.style.zIndex == "0")
            move_body(messageBody, profileBody, buttonSplit)
        else
            move_body(profileBody, messageBody, buttonSplit)
}

buttonMenuProfile.onclick = () =>{
    // funcLoad(localStorage.getItem("curLogin"))
    if (messageBody.style.zIndex == "2")
        swap(messageBody, profileBody)
    else if (picturesBody.style.zIndex == "2")
        swap(picturesBody, profileBody)
}

buttonMenuMessage.onclick = () =>{
    if (profileBody.style.zIndex == "2")
        swap(profileBody, messageBody)
    else if (picturesBody.style.zIndex == "2")
        swap(picturesBody, messageBody)
}

buttonMenuPictures.onclick = () =>{
    if (messageBody.style.zIndex == "2")
        swap(messageBody, picturesBody)
    else if (profileBody.style.zIndex == "2")
        swap(profileBody, picturesBody)
    
        if (firstTime)
        {
            loadPosts()
            firstTime = false
        }
}


isplaying = false
dalmatien.onclick = () => {
    if (isplaying)
    {
        audio.pause()
        isplaying = false
    }
    else
    {
        audio.play()
        isplaying = true
    }
}

const singOut = document.getElementById("sing-out")
singOut.onclick = () =>
{
    localStorage.clear()
    document.location.href = "login.html"
}

document.getElementById("loadProfileImg").onclick = () =>
{
    document.getElementsByClassName("window")[0].style.display = "inline"
}

document.getElementsByClassName("closeWindow")[0].onclick = () =>
{
    document.getElementsByClassName("window")[0].style.display = "none"
}

document.getElementById("inputImg").onchange = () =>
{
    let f = document.getElementById("inputImg").files[0];
    console.log(f)
    document.getElementById("userImg").style.backgroundImage = "url("+ URL.createObjectURL(f) +")"
}

document.getElementById("toMyPage").onclick = () =>
{
    document.getElementById("icon-toMyPage").onclick()
}

document.getElementById("icon-toMyPage").onclick = () =>
{
    if (document.getElementById("login-profile").textContent !=localStorage.getItem("curLogin"))
    {
        funcLoad(localStorage.getItem("curLogin"))
        document.getElementById("input-search").value = ""
    }
}

document.getElementsByClassName("loadOk")[0].onclick = async () =>
{
    //send picture type = 20
    
    let f = document.getElementById("inputImg").files[0];
    console.log(f.type)
    if (f.size>2000000 || (f.type != "image/jpeg" && f.type != "image/png"))
        alert("Image size must be < 2 mb and have type jpeg or png")
    else
    {
        document.getElementsByClassName("window")[0].style.display = "none"
        document.getElementById("img-profile").style.backgroundImage = "url("+ URL.createObjectURL(f) +")"
        data = {
            type: 20,
            login: localStorage.getItem("curLogin")
        }
        let response = await fetch(realUrl, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    console.log("ok")
                    if (f) {
                        //    alert(URL.createObjectURL(f))
                        let res = await fetch(realUrl, {
                            method: 'POST',
                            body: f
                        })
                        
                        if (res.ok) {
                            document.getElementById("img-profile").style.backgroundImage = "url("+ URL.createObjectURL(f) +")"
                            // let pic = await response.blob()
                            // document.getElementById("dialog-user-pic").src = URL.createObjectURL(pic)
                            // // console.log(typeof response.items)
                            // console.log(pic)
                        } else {
                            alert("Ошибка HTTP: " + res.status);
                        }
                        // localStorage.setItem('myImage', image1.src);
                    }
                } else {
                    alert("Ошибка HTTP: " + response.status);
                }
    }
}

document.getElementById("icon-search").onclick = async () => {
    login = document.getElementById("input-search").value
    if (login)
    {
        await funcLoad(login)
        if ((document.getElementById("login-profile").textContent != localStorage.getItem("curLogin")))
            document.querySelectorAll("#request-to-user button")[0].style.display = "block"
    }
}

document.getElementById("input-search").addEventListener('keydown', function(e) {
    if (e.keyCode == 13){
        document.getElementById("icon-search").onclick()
    }
})

async function funcLoad(login)
{
    data = {
        type: 35,
        login: login
    }

    let resData = await fetch(realUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (resData.ok) {

        resData = await resData.json()

        if (resData.code == "OK")
        {
            document.getElementById("login-profile").innerText = resData.login
            document.getElementById("username-profile").innerText = resData.name + " " + resData.surname
            document.getElementsByClassName("other-info-profile")[0].innerText = resData.login
            document.getElementsByClassName("other-info-profile")[1].innerText = resData.name
            document.getElementsByClassName("other-info-profile")[2].innerText = resData.surname
            document.getElementsByClassName("other-info-profile")[3].innerText = resData.age
            document.getElementsByClassName("other-info-profile")[4].innerText = resData.city

            if (resData.login == localStorage.getItem("curLogin"))
                document.querySelectorAll("#request-to-user button")[0].style.display = "none"

            loadPhoto()

            async function loadPhoto()
            {
                //type 10 - get picture
                data = {
                    type: 10,
                    login: resData.login
                }
                let response = await fetch(realUrl, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })

                        if (response.ok) {
                            let userPhoto = await response.blob()
                            if (userPhoto.size > 0)
                                document.getElementById("img-profile").style.backgroundImage = "url("+ URL.createObjectURL(userPhoto) +")"
                            else
                                document.getElementById("img-profile").style.backgroundImage = "url(img/img-profile.jpg)" 
                        } else {
                            alert("Ошибка HTTP: " + response.status);
                        }
            }

        }
        else 
            alert("This user is not defind")

    } else {
                alert("Ошибка HTTP: " + response.status);
    }

}

document.getElementsByClassName("main-message")[0].style.marginLeft = window.getComputedStyle(document.getElementById("caption")).marginLeft
document.getElementsByClassName("main-profile")[0].style.marginLeft = window.getComputedStyle(document.getElementById("caption")).marginLeft
document.getElementsByClassName("main-pictures")[0].style.marginLeft = window.getComputedStyle(document.getElementById("caption")).marginLeft


document.addEventListener("DOMContentLoaded", function(event)
{
    window.onresize = function() {
        document.getElementsByClassName("main-message")[0].style.marginLeft = window.getComputedStyle(document.getElementById("caption")).marginLeft
        document.getElementsByClassName("main-profile")[0].style.marginLeft = window.getComputedStyle(document.getElementById("caption")).marginLeft
        document.getElementsByClassName("main-pictures")[0].style.marginLeft = window.getComputedStyle(document.getElementById("caption")).marginLeft
    };
});