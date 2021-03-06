const https = require('https')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2')
const Stream = require('stream').Transform


dbData = JSON.parse(fs.readFileSync("./config.json"))
const connection = mysql.createPool({
    host     : dbData.host,
    port     : dbData.port,
    user     : dbData.user,
    password : dbData.password,
    database : dbData.database,
  });

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}

const server = https.createServer(options)

function loadpage(filePath, req, res) {
    
    let contentType = "text/html"

    switch(path.extname(filePath))
    {
        case '.css':
            {
            contentType = "text/css"
            break
            }
        case ".js":
            contentType = "text/javascript"
            break
        default:
            contentType = "text/html"
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, {
                "Content-Type": "text/html"
            })
            res.end("Error. Try <a href='http://localhost:3000/login.html'>this</a>")
        }
        res.writeHead(200, {
            "Content-Type": contentType
        })

        res.end(data) 

    })
}

let currentLoginForLoadImg = ""
let currentIdForPost = ""

server.on('request', (req, res) => {
    //type: 1-message
    var data = new Stream();
    if (req.method == "POST") {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            data.push(chunk)
        });
        req.on('end', () => {
            // fs.writeFileSync('image.jpg', data.read());
            blob = data.read()
            let params 
            try {
                params = JSON.parse(body)
                // console.log(params)
            } catch (err)
            {
                console.log("Must be a picture..")
            }
            
            if (params!=undefined)
            {
                if (params.type == 0)  //login
                {  
                    let login = ""
                    let password = ""
                    let curLogin = params.login
                    let curPassword = params.password

                    connection.promise().query("SELECT * FROM dalmatien.users WHERE login = ? and password = ?", [curLogin, curPassword])
                    .then(result =>{
                                if (result[0][0] != undefined)
                                {
                                    password = result[0][0].password
                                    console.log(params.login + " " + params.password + " truePas=" + password)
                                        if (curPassword == password)
                                        {
                                            login = curLogin
                                            let data = {
                                                code: "OK",
                                                id: result[0][0].id,
                                                login: result[0][0].login,
                                                name: result[0][0].name,
                                                surname: result[0][0].surname,
                                                age: result[0][0].age,
                                                city: result[0][0].city
                                            }
                                            res.end(JSON.stringify(data))
                                            console.log("login...")
                                        } 
                                        else 
                                        {
                                            res.end(JSON.stringify("Wrong password"))
                                            console.log("Wrong password");
                                        }
                                }
                                else
                                {
                                    res.end(JSON.stringify("User is not defind"))
                                    console.log("User is not defind")
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                            });
                }
                else if (params.type == 1) //registration
                {
                    connection.promise().query("SELECT * FROM dalmatien.users WHERE login = ? and password = ?;", [params.login, params.password])
                        .then(result1 =>{
                            if (result1[0][0] != undefined)
                                res.end(JSON.stringify("This user is already registered"))
                            else
                            {
                            connection.promise().query("INSERT INTO dalmatien.users (login, password, name, surname, age, city) VALUES ( ? , ? , ? , ? , ? , ? );", [params.login, params.password, params.name, params.surname, params.age, params.city])
                            .then(result =>{
                                        //console.log(result[0].insertId)
                                        res.end(JSON.stringify(result[0].insertId))
                                        console.log("Resgistration user - successfull")
                                    })
                                    .catch(err =>{
                                        if (err.errno == 1062)
                                        {
                                            res.end(JSON.stringify("User with this login is already registered"))
                                            console.log("User with this login is already registered")
                                        }
                                        else if (err.errno == 1366)
                                        {
                                            res.end(JSON.stringify("Incorrect age data"))
                                            console.log("Incorrect age data")
                                        }
                                        else
                                        {
                                            res.end(JSON.stringify("Unpredictable error with DB"))
                                            console.log(err)
                                        }
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            res.end(JSON.stringify("ERROR"))
                        })
                }
                else if (params.type == 2) //new message
                {
                    //SELECT id FROM dalmatien.contacts WHERE (login_user1 = "admin" and login_user2="classic") or (login_user1 = "Classic" and login_user2="admin");
                    
                    connection.promise().query("SELECT id FROM dalmatien.contacts WHERE (login_user1 = ? and login_user2=?) or (login_user1 = ? and login_user2=?);", [params.login_sender, params.login_getter, params.login_getter, params.login_sender])
                    .then(result1 =>{
                        connection.promise().query("INSERT INTO dalmatien.messages (id_contact, message, date, login_sender) VALUES (?, ?, ?, ?);", [result1[0][0].id, params.message, params.date, params.login_sender])
                        .then(result =>{
                            res.end(JSON.stringify("OK"))
                        })
                        .catch(err => {
                            res.end(JSON.stringify("ERROR"))
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.end(JSON.stringify("ERROR"))
                    })
                }
                else if (params.type == 3) //get info about user
                {
                    connection.promise().query("SELECT * FROM dalmatien.users WHERE id= ? ;", [params.login])
                    .then(result =>{
                        let data = {
                            code: "OK",
                            login: result[0][0].login,
                            name: result[0][0].name,
                            surname: result[0][0].surname,
                            age: result[0][0].age,
                            city: result[0][0].city,
                            photo: result[0][0].photo,
                            id: result[0][0].id
                        }
                        res.end(JSON.stringify(data))
                    })
                    .catch(err => {
                        console.log(err)
                        let data = {code: "ERROR"}
                        res.end(JSON.stringify(data))
                    })
                }
                else if (params.type == 35) //get info about user update
                {
                    connection.promise().query("SELECT * FROM dalmatien.users WHERE login rlike ? ;", [params.login])
                    .then(result =>{
                        let data = {
                            code: "OK",
                            login: result[0][0].login,
                            name: result[0][0].name,
                            surname: result[0][0].surname,
                            age: result[0][0].age,
                            city: result[0][0].city,
                            photo: result[0][0].photo,
                            id: result[0][0].id
                        }
                        res.end(JSON.stringify(result[0]))
                    })
                    .catch(err => {
                        console.log(err)
                        let data = {code: "ERROR"}
                        res.end(JSON.stringify(data))
                    })
                }
                else if (params.type == 4)
                {
                    connection.promise().query("SELECT * FROM dalmatien.contacts WHERE (login_user1 = ? AND login_user2 = ?) or (login_user1 = ? AND login_user2 = ?);", [params.login1, params.login2, params.login2, params.login1])
                    .then(result =>{
                        if (result[0][0]==undefined)
                        {
                            connection.promise().query("INSERT INTO dalmatien.contacts (login_user1, login_user2, type) VALUES ( ? , ? , ? );", [params.login1, params.login2, params.type_request])
                            .then(result =>{
                                res.end(JSON.stringify("OK"))
                            })
                            .catch(err => {
                                console.log(err)
                                res.end(JSON.stringify("ERROR"))
                            })
                        }
                        else if (result[0][0].type == 1)
                            if (result[0][0].login_user1 == params.login1)
                                res.end(JSON.stringify("Запрос уже был отправлен"))
                            else
                                {
                                    connection.promise().query("UPDATE dalmatien.contacts SET type = '2' WHERE (id = ?);", [result[0][0].id])
                                    .then(result =>{
                                        res.end(JSON.stringify("Пользователь добавлен в ваши контакты"))
                                    })
                                }
                        else if (result[0][0].type == 2)
                            res.end(JSON.stringify("Пользователь уже у вас в контактах"))
                        else
                            res.end(JSON.stringify("ERROR"))
                    })
                    .catch(err => {
                        console.log(err)
                        res.end(JSON.stringify("ERROR"))
                    })
                }
                else if (params.type == 5) // 5 - contacts data                  
                {
                    connection.promise().query("SELECT id, login, name, surname, photo FROM dalmatien.users WHERE id IN (SELECT login_user1 FROM dalmatien.contacts WHERE (login_user2 = ? and type <> 0) UNION SELECT login_user2 FROM dalmatien.contacts WHERE (login_user1 = ? and type <> 0));", [params.login, params.login])
                    .then(result =>{
                        connection.promise().query("SELECT * FROM dalmatien.contacts WHERE (login_user1 = ? or login_user2 = ?);", [params.login, params.login])
                            .then(result2 =>{
                                for (let i = 0; i<result[0].length; i++)
                                    for (let j = 0; j<result[0].length; j++)
                                    {
                                        if ((result2[0][i].login_user1 == result2[0][i].login_user2) && (result2[0][i].login_user1 == result[0][j].id))
                                        {
                                            result[0][j].type = 2
                                            result[0][j].id_contact = result2[0][i].id
                                        }
                                        else if ((result[0][j].id == result2[0][i].login_user1) && (result[0][j].id != params.login))
                                        {
                                            result[0][j].type = result2[0][i].type
                                            result[0][j].id_contact = result2[0][i].id
                                        }
                                        else if ((result[0][j].id == result2[0][i].login_user2) && (result[0][j].id != params.login))
                                        {
                                            result[0][j].type = result2[0][i].type
                                            result[0][j].id_contact = result2[0][i].id
                                        }
                                    }
                                res.end(JSON.stringify(result[0]))
                            })
                            .catch(err => {
                                console.log(err)
                                res.end(JSON.stringify("ERROR"))
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        let data = {code: "ERROR"}
                        res.end(JSON.stringify(data))
                    })
                }
                else if (params.type == 6)
                {
                    connection.promise().query("SELECT photo FROM dalmatien.users WHERE login IN (SELECT login_user1 FROM dalmatien.contacts WHERE (login_user2 = ? and type <> 0) UNION SELECT login_user2 FROM dalmatien.contacts WHERE (login_user1 = ? and type <> 0));", [params.login, params.login])
                    .then(result =>{
                        res.end(result[0][params.i].photo)
                    })
                    .catch(err => {
                        console.log(err)
                        let data = {code: "ERROR"}
                        res.end("JSON.stringify(data)")
                    })
                }
                else if (params.type == 7)
                {//get messages with userN
                    connection.promise().query("SELECT * FROM dalmatien.messages WHERE id_contact = ? ORDER BY date;", [params.id_contact])
                    .then(result =>{
                        res.end(JSON.stringify(result[0]))     
                    })
                    .catch(err => {
                        console.log(err)
                        res.end("ERROR")
                    })
                }
                else if (params.type == 8)
                {//get posts
                    //SELECT text FROM dalmatien.posts WHERE login IN (SELECT login_user1 FROM dalmatien.contacts WHERE (login_user2 = "classic" and type = 2) UNION SELECT login_user2 FROM dalmatien.contacts WHERE (login_user1 = "classic" and type = 2)) ORDER BY id;
                    connection.promise().query("SELECT id,login,name,surname,photo FROM dalmatien.users WHERE id IN (SELECT login FROM dalmatien.posts WHERE login IN (SELECT login_user1 FROM dalmatien.contacts WHERE (login_user2 = ? and type = 2) UNION SELECT login_user2 FROM dalmatien.contacts WHERE (login_user1 = ? and type = 2)))", [params.login, params.login])
                    .then(result =>{
                            connection.promise().query("SELECT * FROM dalmatien.posts WHERE login IN (SELECT login_user1 FROM dalmatien.contacts WHERE (login_user2 = ? and type = 2) UNION SELECT login_user2 FROM dalmatien.contacts WHERE (login_user1 = ? and type = 2)) ORDER BY id DESC;", [params.login, params.login])
                            .then(result2 =>{
                                
                                for (let i = 0; i<result2[0].length; i++)
                                {
                                    for (let j = 0; j<result[0].length; j++)
                                        if (result[0][j].id == result2[0][i].login)
                                        {
                                            result2[0][i].name = result[0][j].name
                                            result2[0][i].surname = result[0][j].surname
                                            result2[0][i].photo = result[0][j].photo
                                            result2[0][i].login = result[0][j].login
                                        }
                                }
                                res.end(JSON.stringify(result2[0]))
                            })
                            .catch(err => {
                                console.log(err)
                                res.end(JSON.stringify("ERROR"))
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.end(JSON.stringify("ERROR"))
                        })
                }
                else if (params.type == 9)
                {
                    connection.promise().query("SELECT img FROM dalmatien.posts WHERE id= ? ;", [params.id])
                    .then(result =>{
                        //result[0][0].photo - photo from DB dalmatien.users

                        // console.log(result[0][0].photo)
                        // console.log(Object.keys(result[0][0]))
                        // fs.writeFileSync('image.jpg', result[0][0].photo); 
                        res.end(result[0][0].img)        
                    })
                    .catch(err => {
                        console.log(err)
                        res.end("ERROR")
                    })
                }
                else if (params.type == 10) //user photo
                {
                    connection.promise().query("SELECT photo FROM dalmatien.users WHERE login= ? ;", [params.login])
                    .then(result =>{
                        //result[0][0].photo - photo from DB dalmatien.users

                        // console.log(result[0][0].photo)
                        // console.log(Object.keys(result[0][0]))
                        // fs.writeFileSync('image.jpg', result[0][0].photo); 
                        res.end(result[0][0].photo)        
                    })
                    .catch(err => {
                        console.log(err)
                        res.end("ERROR")
                    })
                }
                else if (params.type == 15)
                {
                    connection.promise().query("INSERT INTO dalmatien.posts (login, text) VALUES (?, ?)", [params.login, params.text])
                    .then(result =>{
                        currentIdForPost = result[0].insertId
                        res.end(JSON.stringify(result[0].insertId))        
                    })
                    .catch(err => {
                        console.log(err)
                        res.end("ERROR")
                    })
                }
                else if (params.type == 16)
                {
                    //UPDATE posts SET text = 'hehe' WHERE id = '1';
                }
                else if (params.type == 20)
                {
                    currentLoginForLoadImg = params.login
                    res.end("OK")
                }
            }
            else
            {   //uploda image to DB
                // fs.writeFileSync('image.jpg', blob);
                if (currentLoginForLoadImg != "")
                {
                    let path = "./users_images/User_"+currentLoginForLoadImg+'.jpg'
                    fs.writeFileSync("../frontend/"+path, blob)
                    connection.promise().query("UPDATE dalmatien.users SET photo = ? WHERE (id = ? );", [path, currentLoginForLoadImg])
                        .then(result =>{
                            res.end("OK")
                            currentLoginForLoadImg = ""
                        })
                        .catch(err => {
                            console.log(err)
                            res.end("ERROR")
                        })
                }
                else if (currentIdForPost != "")
                {
                    let path = "./posts_images/Post_"+currentIdForPost+'.jpg'
                    fs.writeFileSync("../frontend/"+path, blob)
                    connection.promise().query("UPDATE posts SET img = ? WHERE id = ?;", [path, currentIdForPost])
                        .then(result =>{
                            res.end("OK")
                            currentIdForPost = ""
                        })
                        .catch(err => {
                            console.log(err)
                            res.end("ERROR")
                        })
                }
                else 
                    res.end("Error with upload img to DB")
            }
        });
    }
    else {
        fp = path.join(__dirname, "/../frontend", req.url === "/" ? "index.html" : req.url)
        loadpage(fp, req, res)
    }

    
})

server.listen(443, () => {
    console.log('Server listening at https://localhost:443')
})
