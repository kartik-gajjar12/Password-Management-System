var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/password",{useNewUrlParser:true,useUnifiedTopology: true});




var categoryschema=mongoose.Schema({

    username:{
        type:String,
        required:true,
    
    },
    category_name:{
        type:String,
        required:true
       
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var category_modal=mongoose.model('password_category',categoryschema);

module.exports=category_modal;