const mongoose=require('mongoose')
const RegisterSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const registerModel=mongoose.model("regSchema",RegisterSchema)
module.exports=registerModel;