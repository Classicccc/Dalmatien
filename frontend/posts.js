loadPosts()

let timerId2 = setInterval(async () => {
    loadPosts()
}, 60000);

async function loadPosts()
{
    document.getElementsByClassName("posts")[0].innerHTML = "Update your posts..."
    //type 8 -load posts
    const data = {
        type: 8,
        login: localStorage.getItem("curLogin"),
    }

    let resData = await newFetch(data)

    let resDataPhotos = []
    for (let i = 0; i<resData.length; i++)
    {
        data2 = {
            type: 10,
            login: resData[i].login
        }

        response = await fetch(realUrl, {
            method: 'POST',
            body: JSON.stringify(data2),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (response.ok) {
            let userPhoto = await response.blob()
            if (userPhoto.size > 0)
                resDataPhotos.push(userPhoto)
            else
                resDataPhotos.push(undefined)
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }
    let resDataImg = []
    for (let i = 0; i<resData.length; i++)
    {
        data2 = {
            type: 9,
            id: resData[i].id
        }

        response = await fetch(realUrl, {
            method: 'POST',
            body: JSON.stringify(data2),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (response.ok) {
            let userPhoto = await response.blob()
            if (userPhoto.size > 0)
                resDataImg.push(userPhoto)
            else
                resDataImg.push(undefined)
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }

    document.getElementsByClassName("posts")[0].innerHTML = "Posts are displayd here"
    for (let i = 0; i< resData.length; i++)
    {
        let post = document.createElement("div")
        post.className = "post"

        let contact = document.createElement("div")
        contact.className = "contact"
        contact.style.borderBottom = "none"
        post.appendChild(contact)

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
        if (resDataPhotos[i] != undefined)
            contactImg.style.backgroundImage = "url("+ URL.createObjectURL(resDataPhotos[i]) +")"

        contact.appendChild(contactImg)

        let contentPost = document.createElement("div")
        contentPost.className = "content-post"
        post.appendChild(contentPost)

        let textContentPost = document.createElement("div")
        textContentPost.className = "text-content-post"
        textContentPost.innerText = resData[i].text
        contentPost.appendChild(textContentPost)

        if (resDataImg[i] != undefined)
        {
            let picContentPost = document.createElement("img")
            picContentPost.className="pic-content-post"
            picContentPost.src = URL.createObjectURL(resDataImg[i])
            contentPost.appendChild(picContentPost)
        }

        document.getElementsByClassName("posts")[0].appendChild(post)
    }
}