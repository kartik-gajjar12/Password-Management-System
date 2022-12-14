const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/password",{useNewUrlParser:true,useUnifiedTopology: true});


var adminschema=mongoose.Schema({

    username:{
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
    
    date:{
        type:Date,
        default:Date.now
    }

});


var adminmodel=mongoose.model('admin',adminschema);

module.exports=adminmodel;



// var admindata=new adminmodel({
//     username:"admin",
//     password:"admin"
// });

// admindata.save((err,data)=>{
//     if(err) throw err;

//     console.log("done");
// });





