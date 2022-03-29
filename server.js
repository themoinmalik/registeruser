require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');


const app = express();

const port = process.env.PORT || 8000;

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/register-api", (err) => {
    if (err) throw err;
    console.log("connection successful...");
});
// importing models 

const User = require("./src/models/usermodel");



// makic public folder

app.use(express.static(path.join(__dirname, "./public")));
// template engines 
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./templates/views"));
hbs.registerPartials("./templates/partials")
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Routes
app.get('/', (req, res,) => {
    res.render("index")
});


app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
})



// register routes 

app.post("/register", async (req, res) => {
    try {


        const new_user = await new User({
            username: req.body.username,
            password: req.body.password
        });


        // generATE TOKEN 

        const token = new_user.generateAuthToken();

        console.log(token)




        new_user.save()

        res.render("login")

    } catch (e) {
        res.send(e)
    }
})



// login post 

app.post('/login', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const userData = await User.findOne({ username: username });
        console.log(userData.password);

        const match = await bcrypt.compare(password, userData.password);
        console.log(match);

        const token = await userData.generateAuthToken();
        console.log(token)



        if (match) {
            res.status(200).render('home');
        } else {
            res.status(404).send("invalid passwird or username")
        }


    } catch (error) {
        console.log("invalid login details", error)

    }
});


// testing the bcrypt password 
// const bcrypt = require('bcryptjs')
// const hashPassword = async (password) => {
//     const hash = await bcrypt.hash(password, 10)

//     const match  = await bcrypt.compare("hello", hash)
//     console.log((match))

// }

// hashPassword("moin@123");



// working with the jsonwebtoken
// const jwt = require("jsonwebtoken");


// const createToken = async () => {
//     const token  = await jwt.sign({_id: "624329133338dccaaac5c272"}, SECRET_KEY,
//     {expiresIn:"2 minutes"})
//     console.log(token);
//     const userverify = await jwt.verify(token, SECRET_KEY);
//     console.log(userverify);
// }

// createToken()

app.listen(port, () => { console.log('listening on port 8000') });