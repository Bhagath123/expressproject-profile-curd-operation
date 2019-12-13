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
//load profile schema model
require('./Model/Profile');
const databaseconnection=mongoose.model('profile');//profile must be same as the model 
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
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
});
const uploads =multer({
    storage:storage
});
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.get('/',(req,res)=>{
   res.render('home.handlebars');
});

app.get("/profile/addprofile",(req,res)=>{
    res.render("profile/addprofile")
});

//profile page route
app.get("/profile/userprofile",(req,res)=>{
    //fetching data from database
    databaseconnection.find({}).then(profile=>{
        res.render('profile/userprofile',{
            profile:profile
        });

    }).catch(err=>{
        if(err) throw err
    });
});
//cfreate edit profile route
app.get('/profile/editprofile/:id',(req,res)=>{
    databaseconnection.findOne({_id:req.params.id}).then(profile=>{
        res.render('profile/editprofile',{
            profile:profile
        })
    }).catch(err=>{
        console.log(err);
          })
})
//create profile by using http post
app.post('/profile/addprofile',uploads.single('photo'),(req,res)=>{
  const  errors=[];
    if(!req.body.name){
        errors.push({text:'name is required'})
    }
    if(!req.body.phonenumber){
        errors.push({text:'phonenumber is required'});
    }
    if(!req.body.company){
        errors.push({text:'company is required'});
    }
    if(!req.body.location){
        errors.push({text:'location is required'});
    }
    if(!req.body.education){
        errors.push({text:'education is required'});
    }
    if(errors.length>0){
        res.render('profile/addprofile',{
        errors:errors,
        })
    }else{
        //collecting information
        const newProfile={
            photo:req.file,
            name:req.body.name,
            phonenumber:req.body.phonenumber,
            company:req.body.company,
            location:req.body.location,
            education:req.body.education
        }
        //to save to data base
        new databaseconnection(newProfile).save().then(profile=>{
            console.log(profile);
            req.flash('success_msg','successfully profile stored');
            res.redirect('/profile/userprofile');
        }).catch(err=>{console.log(err);
        })
    }
 });
//editprofile putmethod route here
app.put('/profile/editprofile/:id',uploads.single('photo'),(req,res)=>{
    databaseconnection.findOne({_id:req.params.id}).then(profile=>{
       profile.photo=req.file;
       profile.name=req.body.name;
       profile.phonenumber=req.body.phonenumber;
       profile.company=req.body.company;
       profile.location=req.body.location;
       profile.education=req.body.education;
       //save to database
        profile.save().then(profile=>{
            req.flash('success_msg','successfully profile updated');
         res.redirect('/profile/userprofile');
        }).catch(err=>{
            if(err) throw err
        })
    });
    //delete profile route
    app.delete('/profile/deleteprofile/:id',(req,res)=>{
        databaseconnection.remove({_id:req.params.id}).then(profile=>{
            req.flash('error_msg','successfully profile deleted');
            res.redirect('/profile/userprofile');
        });
    });
});
app.get('**',(req,res)=>{
    res.render("404.handlebars");
})
const port=process.env.PORT||5000;
app.listen(port,(err) => {
    if(err) throw err
    else
    console.log("app is running");
});