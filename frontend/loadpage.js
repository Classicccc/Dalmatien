
//type 3 - get info about user
funcLoad()

async function funcLoad()
{ 
    data = {
        type: 3,
        login: localStorage.getItem("curLogin")
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
            document.getElementsByClassName("other-info-profile")[5].innerText = resData.id

            if (resData.photo)
                document.getElementById("img-profile").style.backgroundImage = "url("+ resData.photo +")"
            else
                document.getElementById("img-profile").style.backgroundImage = "url(img/img-profile.jpg)" 
        }
    }
}
