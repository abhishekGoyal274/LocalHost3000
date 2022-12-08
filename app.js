//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const homeStartingContent = "Here is a site by community for community. Our aim is to provide in need by whom which can provide.";
const aboutContent = "Hello my name is Abhishek Goyal and I am currently a student of Punjab University Chandigarh. I have made this blog project as a summer traing camp project. Its a small project made with just basics but I am hoping to learn more and made this little blog good.";
const email = "E-mail: Abhishegoyal274@gmail.com";
const mobile = "Mobile Number: 9056531455 ";
const adress = "Adress: India, Punjab, Abohar.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [];
// Get Request SetUp

mongoose.connect("mongodb+srv://Abhishek-admin:Tango_0range@cluster0.hsdpq.mongodb.net/HackUIET", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    title: String,
    name: String,
    phone: Number,
    email: String,
    post: String
});

const User = new mongoose.model("User", userSchema);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/LandingPage.html");
})

app.get('/homePage', function(req, res) {
    res.render('homePage');
})

app.get('/home', function(req, res) {
    User.find({}, function(err, found) {
        res.render('home', { homeContent: homeStartingContent, posts: found });
    });
})

app.get('/about', function(req, res) {
    res.render('about', { aboutContent: aboutContent });
})

app.get('/contact', function(req, res) {
    res.render('contact', { email: email, mobile: mobile, adress: adress });
})

app.get('/compose', function(req, res) {
    res.render('compose');
})


// Post Request SetUp

app.post('/compose', function(req, res) {
    const newUser = new User({
        title: req.body.title,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email.toUpperCase(),
        post: req.body.post
    });
    newUser.save();
    res.redirect('/home');
})

app.get('/posts/:title', function(req, res) {

    let reqTitle = req.params.title;
    User.find({}, function(err, found) {
        found.forEach(function(items) {
            if (_.lowerCase(reqTitle) === _.lowerCase(items.title)) {
                res.render("post", { title: items.title, content: items.post, name: items.name, phone: items.phone, email: items.email })
            } else {
                console.log('No Match Found.')
            }
        })
    });

});

app.listen(process.env.PORT || 4000, function() {
    console.log("Server started on port 4000");
});