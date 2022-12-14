var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/password",{useNewUrlParser:true,useUnifiedTopology: true});

var pass_detailschema=mongoose.Schema({

    username:{
        type:String,
        required:true,
    
    },
    category_name:{
        type:String,
        required:true
       
    },
    password_details:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var passdetails_modal=mongoose.model('password_details',pass_detailschema);

module.exports=passdetails_modal;