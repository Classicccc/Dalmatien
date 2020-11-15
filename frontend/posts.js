loadPosts()

let timerId2 = setInterval(async () => {
    loadPosts()
}, 60000);

async function loadPosts()
{
    document.getElementsByClassName("posts")[0].innerHTML = "Your posts are displayd here "
    let infoPost = document.createElement("i")
                infoPost.className = "fa fa-spinner fa-pulse"
                document.getElementsByClassName("posts")[0].appendChild(infoPost)
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
        
                contentPost = document.createElement("div")
                contentPost.className = "content-post"
                post.appendChild(contentPost)
        
                let textContentPost = document.createElement("div")
                textContentPost.className = "text-content-post"
                textContentPost.innerText = resData[i].text
                contentPost.appendChild(textContentPost)

                document.getElementsByClassName("posts")[0].appendChild(post)
        
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

                if (resDataImg[i] != undefined)
                {
                    let picContentPost = document.createElement("img")
                    picContentPost.className="pic-content-post"
                    picContentPost.src = URL.createObjectURL(resDataImg[i])
                    document.getElementsByClassName("content-post")[i].appendChild(picContentPost)
                }
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }
    
    infoPost.style.visibility = "hidden"
}