let fileOk = false
let f

document.getElementById("attach-pic").onclick = () =>
{
    document.getElementsByClassName("window")[1].style.display = "inline"
}
document.getElementById("inputImgForPost").onchange = () =>
{
    let f = document.getElementById("inputImgForPost").files[0];
    document.getElementById("userImgPost").style.backgroundImage = "url("+ URL.createObjectURL(f) +")"
}
document.getElementsByClassName("closeWindow")[1].onclick = () =>
{
    document.getElementsByClassName("window")[1].style.display = "none"
    fileOk = false
    document.getElementById("userImgPost").style.backgroundImage = "url()"
}
document.getElementsByClassName("loadOk")[1].onclick = async () =>
{
    f = document.getElementById("inputImgForPost").files[0];
    console.log(f.size)
    if (f.size>2000000)
    {
        alert("Image size must by < 2 mb")
        fileOk = false
    }
    else
    {
        fileOk = true
        document.getElementsByClassName("window")[1].style.display = "none"
    }
}

document.getElementById("add-post").onclick = async () =>
{
    let text = document.getElementsByClassName("input-text-post")[0].value
    if (text != "")
    {
        document.getElementsByClassName("posts")[0].innerHTML = "Update your posts..."
        const data = {
            type: 15,
            login: localStorage.getItem("curLogin"),
            text: text
        }

        document.getElementsByClassName("input-text-post")[0].value = ""



        let resData = await newFetch(data)
        if (fileOk == true)
        {
            console.log(resData)
            let res = await fetch(realUrl, {
                method: 'POST',
                body: f
            })
            
            if (res.ok) {
                loadPosts()
            } else {
                alert("Ошибка HTTP: " + res.status);
            }
            document.getElementsByClassName("closeWindow")[1].onclick
        }

    }
    else 
        alert("You need type some text for post")
}
