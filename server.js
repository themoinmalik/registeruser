const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');


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


app.post("/register", async (req, res) => {
    try {


        var new_user = new User({
            username: req.body.username,
            password:req.body.password
        })
          
        new_user.save(function(err,result){
            if (err){
                console.log(err);
            }
            else{
                console.log(result)
            }
        })

        res.send(new_user)
    
    } catch (e) {
        res.send(e)
    }
})

app.listen(port, () => { console.log('listening on port 8000') });