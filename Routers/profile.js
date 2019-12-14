const express=require('express');
const mongoose=require('mongoose');
const multer=require('multer');

const router=express.Router();
require('../Model/Profile');
const databaseconnection=mongoose.model('profile');

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
router.get("/addprofile",(req,res)=>{
    res.render("profile/addprofile")
});

//profile page route
router.get("/userprofile",(req,res)=>{
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
router.get('/editprofile/:id',(req,res)=>{
    databaseconnection.findOne({_id:req.params.id}).then(profile=>{
        res.render('profile/editprofile',{
            profile:profile
        })
    }).catch(err=>{
        console.log(err);
          })
})
//create profile by using http post
router.post('/addprofile',uploads.single('photo'),(req,res)=>{
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
router.put('/editprofile/:id',uploads.single('photo'),(req,res)=>{
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
    router.delete('/deleteprofile/:id',(req,res)=>{
        databaseconnection.remove({_id:req.params.id}).then(profile=>{
            req.flash('error_msg','successfully profile deleted');
            res.redirect('/profile/userprofile');
        });
    });
});
module.exports=router;