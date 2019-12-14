const express=require('express');
const mongoose=require('mongoose');
const exphbs=require('express-handlebars');
const multer=require('multer');
const bodyparser=require('body-parser');
const Handlebars=require('handlebars');
var HandlebarsIntl = require('handlebars-intl');//for formatjs date and time 
var methodOverride = require('method-override');
var session=require('express-session');
var flash=require('connect-flash');
const app=express();
HandlebarsIntl.registerWith(Handlebars);
//method override here
app.use(methodOverride('_method'));
//this profile had to give app.use("/profile",profile)
const profile=require('./Routers/profile');
//load auth block here
const users=require('./Routers/auth')

const mongourl="mongodb+srv://Bhagath:Papireddy@cluster0-kmkio.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongourl,{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(err) throw err
    else
    console.log("db is connected");
});
//session middleware here
app.use(
    session({
        secret:"bhagath",
        resave:false,
        saveUninitialized:true
    })
);
//connect flash middleware
app.use(flash());
//create global middleware
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');10
    next();
})

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+"/public"));//it is used to server the static file public folder we need to use this middleware
Handlebars.registerHelper('trimString', function(passedString) {
    var theString =[... passedString].splice(6).join('');
    return new Handlebars.SafeString(theString)
});

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.get('/',(req,res)=>{
   res.render('home.handlebars');
});

// static path
app.use("/profile",profile);
app.use("/user",users);



app.get('**',(req,res)=>{
    res.render("404.handlebars");
})
const port=process.env.PORT||5000;
app.listen(port,(err) => {
    if(err) throw err
    else
    console.log("app is running");
});