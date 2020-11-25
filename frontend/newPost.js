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
    document.getElementById("attach-pic").style.color = "#2196f3"
}
document.getElementsByClassName("closeWindow")[1].onclick = () =>
{
    document.getElementsByClassName("window")[1].style.display = "none"
    fileOk = false
    document.getElementById("attach-pic").style.color = "gray"
    document.getElementById("userImgPost").style.backgroundImage = "url()"
}
document.getElementsByClassName("loadOk")[1].onclick = async () =>
{
    f = document.getElementById("inputImgForPost").files[0];
    console.log(f)
    if (f==undefined)
        alert("Attach some picture or cancel")
    else
    {
        console.log(f.size)
        if (f.size>2000000 || (f.type != "image/jpeg" && f.type != "image/png"))
        {
            alert("Image size must be < 2 mb and have type jpeg or png")
            fileOk = false
            document.getElementById("attach-pic").style.color = "gray"
        }
        else
        {
            fileOk = true
            document.getElementsByClassName("window")[1].style.display = "none"
        }
    }
}

document.getElementById("add-post").onclick = async () =>
{
    let text = document.getElementsByClassName("input-text-post")[0].value
    if (text != "" && text.length<500)
    {
        console.log(text.length)
        document.getElementsByClassName("posts")[0].innerHTML = ""
        const data = {
            type: 15,
            login: localStorage.getItem("curLogin"),
            text: text
        }

        document.getElementsByClassName("input-text-post")[0].value = ""
        document.getElementById("icon-reload-posts").className = "fa fa-spinner fa-pulse"


        let resData = await newFetch(data)
        if (fileOk == true)
        {
            console.log(resData)
            let res = await fetch(realUrl, {
                method: 'POST',
                body: f
            })
            
            if (res.ok) {

            } else {
                alert("Ошибка HTTP: " + res.status);
            }
            document.getElementsByClassName("closeWindow")[1].onclick
        }
        loadPosts()
        fileOk = false
        document.getElementById("attach-pic").style.color = "gray"
    }
    else 
        alert("You need type some text for post (max = 500 symbols)")
}
