
// let timerId2 = setInterval(async () => {
//     loadPosts()
// }, 60000);

document.getElementById("reload-posts").onclick = async () =>
{
    if (document.getElementById("icon-reload-posts").className == "fa fa-history")
    {
        await loadPosts()
    }
}

async function loadPosts()
{
    document.getElementById("icon-reload-posts").className = "fa fa-spinner fa-pulse"
    document.getElementsByClassName("posts")[0].innerHTML = ""
    //type 8 -load posts
    const data = {
        type: 8,
        login: localStorage.getItem("curLogin"),
    }

    let resData = await newFetch(data)

    for (let i = 0; i<resData.length; i++)
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
        if (resData[i].photo != undefined)
            contactImg.style.backgroundImage = "url("+ resData[i].photo +")"

        contact.appendChild(contactImg)

        contentPost = document.createElement("div")
        contentPost.className = "content-post"
        post.appendChild(contentPost)

        let textContentPost = document.createElement("div")
        textContentPost.className = "text-content-post"
        textContentPost.innerText = resData[i].text
        contentPost.appendChild(textContentPost)

        if (resData[i].img != undefined)
        {
            let picContentPost = document.createElement("img")
            picContentPost.className="pic-content-post"
            picContentPost.src = resData[i].img
            post.appendChild(picContentPost)
        }
        document.getElementsByClassName("posts")[0].appendChild(post)
    }
    document.getElementById("icon-reload-posts").className = "fa fa-history"
}