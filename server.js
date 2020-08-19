const express = require('express');
const pug = require('pug');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("dist/"));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.route("/")
.get(function(req, res){
    res.render('index');
})

app.route("/login")
.get(function(req, res){
    res.render("login", {wrongCreds: false});
})
.post(function(req,res){
    // req.body.email. req.body.password and req.body.remember_me -> check if it is there or not.
    res.render("login", {wrongCreds: true});
})

app.route('/signup')
.get(function(req,res){
    res.sendFile(__dirname + "/views/html/signup.html");
})
.post(function(req, res){
    // req.body.
});

app.listen(PORT, function(){
    console.log('Server started on port ' + PORT);
});

