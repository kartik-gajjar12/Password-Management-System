const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/password",{useNewUrlParser:true,useUnifiedTopology: true});


var userschema=mongoose.Schema({

    username:{
        type:String,
        required:true,
        index:{
            unique:true
        }

    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    password:{
        type:String,
        required:true
    },
    secure:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

});


var usermodel=mongoose.model('user',userschema);


module.exports=usermodel;