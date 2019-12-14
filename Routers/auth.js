const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const router=express.Router();
require('../Model/User');
const userSchema=mongoose.model("users");

router.get('/login',(req,res)=>{
    res.render('auth/login');
});
router.get('/register',(req,res)=>{
    res.render('auth/register');
});
router.post('/register',(req,res)=>{
 const errors=[];
 if(req.body.password != req.body.confirmpassword){
     errors.push({text:"password is not matching"});
 }
 if(req.body.password.length<4){
     errors.push({text:"password should be minimum four characters"});
 }
//  if(!req.body.username){
//     errors.push({text:"username is required "});
//  }
//  if(!req.body.email){
//     errors.push({text:"username is required "});
//  }
 if(errors.length>0){
     res.render('auth/register',{
         errors:errors,
         }) 
        }
 else{
     //connect to database and store user information
     userSchema.findOne({ email: req.body.email}).then(user =>{
         if(user){
             req.flash('erroe_msg','eamil is already exist...😇');
             res.redirect("/user/register");
         }
         //bcryptjs password hashing here
         else{
           const newUser={
               username:req.body.username,
               email:req.body.email,
               password:req.body.password,
               confirmpassword:req.body.confirmpassword
               
           }
          
            var bcrypt = require('bcryptjs');
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt,(err, hash) =>{
                  if(err) throw err
                  newUser.password=hash;
                  new userSchema(newUser).save().then(user=>{
                    console.log(user);
                    req.flash('success_msg','successfully registered');
                    res.redirect('/user/login');
                    
                });
            });
             
           }).catch(err =>{
               console.log(err);
               
           })
         }
     }).catch(err=>{
         console.log(err);
         
     })
 }
})

module.exports=router;