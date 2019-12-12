const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ProfileSchema=new Schema({
    photo:{
        type:[],
    },
    name:{
        type:String
,
required:true
    },
    phonenumber:{
         type:String,
         required:true
    },
    company:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    education:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now
    }

});
module.exports=mongoose.model('profile',ProfileSchema);