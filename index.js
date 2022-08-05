const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bodyParser = require('body-parser')
const cors = require('cors')

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())



const db_name = "data/apptest.db";
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
//   var stuff = db.run("select * from users;")
//   console.log(stuff)
});

app.get("/", (req, res) => {
    res.send ("Hello world...");
  });


//Route that handles signup logic
app.post('/register', async (req, res) =>{
    // console.log(req.body.fullname) 
    // console.log(req.body.username)
    // const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    // const user_data = [req.body.username, req.body.password];
    // db.run(sql, user_data, err => {
    //     console.log("could not register user")
    // });
    // console.log(req.body.password) 
    // console.log('someone tried to login')

    try{
        const user_data = [req.body.username, req.body.password];
        let foundUser = db.run("SELECT * FROM users WHERE username LIKE ? AND password LIKE ?", user_data);
        // const foundUser = 0;
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            // let newUser = {
            //     // id: Date.now(),
            //     username: req.body.username,
            //     // email: req.body.email,
            //     password: hashPassword,
            // };
            // users.push(newUser);
            const sql = "INSERT INTO users VALUES (?, ?)";
            db.run(sql, [req.body.username, hashPassword], err => {
                console.log("could not register user")
            });
            
            // console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
})


app.post('/login', async (req, res) => {
    try{
        // let foundUser = users.find((data) => req.body.email === data.email);
        const user_data = [req.body.username, req.body.password];
        let foundUser = db.get("SELECT * FROM users WHERE username = ? AND password = ?;");
        
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});


app.listen(3000, () => {
    console.log("Server started (http://localhost:3000/) !");
  });