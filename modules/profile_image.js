var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/password",{useNewUrlParser:true,useUnifiedTopology: true});

var imageschema=mongoose.Schema({

    username:{
        type:String,
        required:true,
    
    },
    imageurl:{
        type:String,
        required:true
       
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var image_modal=mongoose.model('user_image',imageschema);

module.exports=image_modal;