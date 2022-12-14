var express = require('express');
var router = express.Router();
var usermodel=require('../modules/user.js');
var category_modal=require('../modules/category_tab.js');
var pass_details_modal=require('../modules/password_details.js');
var profile_image_modal=require('../modules/profile_image.js');
var adminmodel=require('../modules/admin.js');
var errmsg="";
var bcryptjs=require('bcryptjs');
var jwt=require('jsonwebtoken');
var multer =require('multer');
var path=require('path');


const {check,validationResult}=require('express-validator');
const passdetails_modal = require('../modules/password_details.js');
const image_modal = require('../modules/profile_image.js');



var msg_var="";




//multer function for upload

var storage=multer.diskStorage({
  destination:"./public/upload/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

//middlewear for upload

var upload=multer({
  storage:storage
}).single('pfile');

router.post("/pofile-upload",checklogin,upload,function(req,res,next){

  var user=localStorage.getItem('username');
 
  

  var checking=profile_image_modal.findOne({username:user});

  checking.exec((err3,data3)=>{
    if(err3) throw err3;

    

    if(data3)
    {
      
      
      var getid=profile_image_modal.findOne({username:user});
       getid.exec((err4,data4)=>{
       if(err4) throw err4;

        var id=data4._id;
        
        var imgupdate=profile_image_modal.findByIdAndUpdate(id,{
          username:user,
          imageurl:req.file.filename
        });

        imgupdate.exec((err5,data5)=>{
          if(err5) throw err5;
        
          errmsg="success,file uploaded";
          res.redirect("/home");
        

        });
 
 
  });




    }
    else
    {
      var img=profile_image_modal({
        username:user,
        imageurl:req.file.filename
      });  
      
      img.save((err,data)=>{
      
        if(err) throw err;
      
        errmsg="success,file uploaded";
        res.redirect("/home");
        
      
      });
      
      
    }
  });





  
});








if(typeof localStorage==="undefined" || localStorage===null)
{

  const LocalStorage=require('node-localstorage').LocalStorage;
  localStorage=new LocalStorage("./scratch");
}






/* GET home page. */
router.get('/', function(req, res, next) {
  var user=localStorage.getItem('username');
  if(user)
  {
    res.redirect("/home");
  }
  else
  {
  res.render('index', { title: 'Password Management System',msg:'' });
  }
});

router.post('/', function(req, res, next) {
  
  var user_name=req.body.txtuser;
  var user_pass=req.body.txtpass;

  
  var checkadmin=adminmodel.findOne({username:user_name});

  checkadmin.exec((err1,data1)=>{

    if(err1) throw err1;

    
    
  if(data1)
  {
    var get_password=data1.password;
    var get_userid=data1._id;
   
    if(user_pass==get_password)
    {

        var token=jwt.sign({userid:get_userid},"logintoken");
        localStorage.setItem('usertoken',token);
        localStorage.setItem('username',data1.username);



      msg_var="login successfully";
      res.redirect("/admin");
     
     
    }
    else{
      res.render('index', { title: 'Password Management System',msg:"invalid password or username" });
    }
  }
  else{


  var checkuser=usermodel.findOne({username:user_name});

  checkuser.exec((err,data)=>{

    if(err) throw err;

    
  if(data)
  {
    var get_password=data.password;
    var get_userid=data._id;
   
    if(bcryptjs.compareSync(user_pass,get_password))
    {

        var token=jwt.sign({userid:get_userid},"logintoken");
        localStorage.setItem('usertoken',token);
        localStorage.setItem('username',data.username);



      msg_var="login successfully";
      res.redirect("/home");
     
     
    }
    else{
      res.render('index', { title: 'Password Management System',msg:"invalid password or username" });
    }
  }
  else{
    res.render('index', { title: 'Password Management System',msg:"invalid username" });
  }
  });

  
  }
  });
  
  
  
});


router.get('/admin', function(req, res, next) {

  var adminname=localStorage.getItem('username');
  var number=usermodel.find({});
  number.exec((err,data)=>{
    if(err) throw err;
    res.render('admin', { title: 'Password Management System',msg:"",count:data.length,records:data,admin:adminname});
  });
  
 

});

router.get('/changeuser', function(req, res, next) {
  var user=localStorage.getItem('username');
  res.render('changeuser', { title: 'Password Management System',msg:"",name:user });

});

router.post('/changeusername', function(req, res, next) {
  
  var username=req.body.txtuname;
  
  var user=localStorage.getItem('username');


  var uname=adminmodel.findOne({username:user});
  uname.exec((err,data)=>{
    if(err) throw err;

    
    if(data)
    {
      
      
      var updatedata=adminmodel.findByIdAndUpdate(data._id,{username:username});
      updatedata.exec((err1,data1)=>{
        if(err1) throw err1;

        localStorage.setItem('username',username);
        
        // res.redirect("/changeuser"); 
        res.render('changeuser', { title: 'Password Management System',msg:"username change successfully",name:"" });
       
      });
    }
    else
    {
      
      res.render('changeuser', { title: 'Password Management System',msg:"something wrong!",name:"" });
    }
  });



});


router.get('/changeadminpass', function(req, res, next) {
  res.render('changeadminpass', { title: 'Password Management System',msg:"" });
});

router.post('/changepass', function(req, res, next) {

  var cpass=req.body.txtcurrpass;
  var npass=req.body.txtnewpass;
  var cnpass=req.body.txtcnewpass;

  var checkp=adminmodel.findOne({password:cpass});
  checkp.exec((err,data)=>{
    if(err) throw err;

    if(data)
    {
      if(npass==cnpass)
      {
        var updatedata=adminmodel.findByIdAndUpdate(data._id,{password:npass});
        updatedata.exec((err1,data1)=>{
          if(err1) throw err1;
          res.render('changeadminpass', { title: 'Password Management System',msg:"updated successfully" });    
        });
        
      }
      else
      {
        res.render('changeadminpass', { title: 'Password Management System',msg:"New password not matched" });  
      }
    }
    else
    {
      res.render('changeadminpass', { title: 'Password Management System',msg:"Old password is wrong" });
    }

  });


  // res.render('changeadminpass', { title: 'Password Management System',msg:"hcyufdycfyefc" });
});




router.get('/forgotpassword', function(req, res, next) {
  res.render('forgotpassword', { title: 'Password Management System',msg:"" });
});

router.post('/forgotp', function(req, res, next) {
 
  var username=req.body.txtfuser;
  var email=req.body.txtfemail;
  var spin=req.body.txtfsecure;
  var npass=req.body.txtfpass;
  var cpass=req.body.txtfcpass;

  var checkuser=usermodel.findOne({username:username});

  checkuser.exec((err,data)=>{
    if(err) throw err;

    if(data)
    {
      if(data.email==email)
      {

        if(bcryptjs.compareSync(spin,data.secure))
        {
          

          if(npass==cpass)
          {
            
            npass=bcryptjs.hashSync(npass,7);

            var updatepass=usermodel.findByIdAndUpdate(data.id,{
              password:npass
            });

            updatepass.exec((err1,data1)=>{
              if(err1) throw err1;

              res.render('forgotpassword', { title: 'Password Management System',msg:"password updated" });

            });
            

          }
          else
          {
            res.render('forgotpassword', { title: 'Password Management System',msg:"New password not matched" });
          }


        }
        else
        {
          res.render('forgotpassword', { title: 'Password Management System',msg:"invalid data" });
        }
        
      }
      else
      {
        res.render('forgotpassword', { title: 'Password Management System',msg:"invalid data" });
      }
    }
    else
    {
      res.render('forgotpassword', { title: 'Password Management System',msg:"data not found" });
    }
  });


});



//============signup==========================================================================


router.get('/signup', function(req, res, next) {
  var user=localStorage.getItem('username');
  if(user)
  {
    res.redirect("/home");
  }
  else
  {
  
  res.render('signup', { title: 'Password Management System',msg:"" });
  }
});


router.post('/signup', function(req, res, next) {
  var username=req.body.txtuser;
  var useremail=req.body.txtemail;
  var userpassword=req.body.txtpass;
  var confirm=req.body.txtcpass;
 var usersecurity=req.body.txtsecure;
   
  var ucheck=usermodel.findOne({username:username});

  if(confirm != userpassword)
  {

    res.render("signup",{title:"Password Management System",msg:"password not matched"});
  }
  else{
  ucheck.exec((err,data)=>{
    if(err) throw err;

    
    if(data){res.render("signup",{title:"Password Management System",msg:"already Username exist"});
    }else{

      userpassword=bcryptjs.hashSync(userpassword,7);
      usersecurity=bcryptjs.hashSync(usersecurity,7);
      var userdetails=new usermodel({

        username:username,
        email:useremail,
        password:userpassword,
        secure:usersecurity
      });
      

      userdetails.save((err1,data)=>{
        if(err) throw err;
        
        res.render("signup",{title:"Password Management System",msg:"user registered"});

      });



    }

  });

}
});


//============================================================================================
router.get('/home',checklogin, function(req, res, next) {
  var name=localStorage.getItem('username');

  var getuser=usermodel.findOne({username:name});
  getuser.exec((err,data)=>{
if(err) throw err;


var prifile_img=profile_image_modal.findOne({username:name});
prifile_img.exec((err1,data1)=>{

  if(err1) throw err1;

  if(data1)
  {
    res.render('home', { title: 'Password Management System' ,user1:data,msg:msg_var,user:name,err:'',update:errmsg,img:data1.imageurl});
msg_var="";
errmsg="";    
  }
  else
  {
    res.render('home', { title: 'Password Management System' ,user1:data,msg:msg_var,user:name,err:'',update:errmsg,img:"bydefault.jpg"});
msg_var="";
errmsg="";
  }



});

});
 
});

router.get('/addnewcategory',checklogin, function(req, res, next) {
  res.render('addnewcategory', { title: 'Password Management System' ,errors:'',msg:''});
  });



router.post('/addnewcategory',checklogin,[check('txtcategoryname','please Enter Category name!').isLength({min:1})], function(req, res, next) {
  const errors=validationResult(req);
  if(!errors.isEmpty()){

    res.render('addnewcategory', { title: 'Password Management System' , errors:errors.mapped()});
  }
  else{

    var user=localStorage.getItem('username');
    var category=req.body.txtcategoryname;

    var category_data=category_modal({
      username:user,
      category_name:category
    });

    var checkcate=category_modal.findOne({$and:[{category_name:category},{username:user}]});

    checkcate.exec((err,data1)=>{

      if(err) throw err;

      if(data1){
        res.render('addnewcategory', { title: 'Password Management System', errors:'',msg:'already exist' });  
      }
      else
      {
        category_data.save((err,data)=>{

          if(err) throw err;
    
          res.render('addnewcategory', { title: 'Password Management System', errors:'',msg:'category inserted' });
    
        });
    
      }

    });
    
    
 


}
});

router.post('/email-update',checklogin,function(req,res,next){


  var user=localStorage.getItem('username');
  var txtemail=req.body.txtdemail;
  var getuser=usermodel.findOne({username:user});
  getuser.exec((err,data)=>{
  if(err) throw err;
  var id=data._id;
      var update_user=usermodel.findByIdAndUpdate(id,{
        email:txtemail
      });
      update_user.exec((err1,data1)=>{
        if(err1) throw err1;
  
  
         res.redirect('/home');
      });
  
  });
  

});

router.post('/update-password',checklogin,function(req,res,next){
var user=localStorage.getItem('username');
var get_user=usermodel.findOne({username:user});
get_user.exec((err,data)=>{
  if(err) throw err;

  var get_pass=data.password;
  var currpass=req.body.currentpass;

  


  if(bcryptjs.compareSync(currpass,get_pass)){

   
    var newpass=req.body.newpass;
    var confirm_newpass=req.body.confirmpass;

    if(newpass==confirm_newpass)
    {

      var getid=usermodel.findOne({username:user});
      getid.exec((err2,data2)=>{

        if(err2) throw err2;

        var id=data2._id;
        var encryptnewpss=bcryptjs.hashSync(newpass,7)
        var updatepass=usermodel.findByIdAndUpdate(id,{
          password:encryptnewpss
        });

        updatepass.exec((err3,data3)=>{
          if(err3) throw err3;

          errmsg="password updated";
          res.redirect("/home");

        });

      });


    }else{

      var name=localStorage.getItem('username');

      var getuser=usermodel.findOne({username:name});
      getuser.exec((err,data)=>{
    if(err) throw err;
    
    res.render('home', { title: 'Password Management System' ,user1:data,msg:msg_var,user:name,err:"both password not matched!",update:'',img:''});
    msg_var="";
      });


    }

  }else{

    var name=localStorage.getItem('username');

    var getuser=usermodel.findOne({username:name});
    getuser.exec((err,data)=>{
  if(err) throw err;
  
  res.render('home', { title: 'Password Management System' ,user1:data,msg:msg_var,user:name,err:"Password was incorrect!",update:'',img:''});
  msg_var="";
    });
   
  
  }
});


});


router.post('/username-update',checklogin,function(req,res,next){
var user=localStorage.getItem('username');
var txtuser=req.body.txtduser;
var getuser=usermodel.findOne({username:user});
getuser.exec((err,data)=>{
if(err) throw err;
var id=data._id;
    var update_user=usermodel.findByIdAndUpdate(id,{
      username:txtuser
    });
    update_user.exec((err1,data1)=>{
      if(err1) throw err1;
      var imguser=localStorage.getItem('username')
      var getid=profile_image_modal.findOne({username:imguser});
      getid.exec((err2,data2)=>{

        if(err2) throw err2;


        if(data2)
        {
          var img_id=data2._id;
          console.log("hwllo"+img_id);
  
          var updateimg=profile_image_modal.findByIdAndUpdate(img_id,{
            username:txtuser
          });
  
          updateimg.exec((err3,data3)=>{
            if(err3) throw err3;
  
            localStorage.setItem('username',txtuser);
  
         res.redirect('/home');
  
          });
  
        }
        else
        {
          localStorage.setItem('username',txtuser);
          res.redirect('/home');
        }
        

        
        
      });
      

      
    });

});

});




router.get('/viewallcategory',checklogin, function(req, res, next) {

    var perpage=5;
    var page=1;
  
    var user=localStorage.getItem('username');
    
    var cate=category_modal.find({username:user}).skip((perpage*page)-perpage).limit(perpage);

    cate.exec((err,data)=>{
      if(err) throw err;

      var countdata=category_modal.countDocuments({username:user});
      countdata.exec((err1,count)=>{

        if(err1) throw err1;

        var totalpage=Math.ceil(count/perpage);
        console.log("count: "+totalpage);
        res.render('viewallcategory', { title: 'Password Management System' ,records:data,current:page,pages:totalpage});
      });

      
    });


    

  
  

});

router.get('/viewallcategory/:page',checklogin, function(req, res, next) {

  var perpage=5;
  var page=req.params.page;

  var user=localStorage.getItem('username');
  
  var cate=category_modal.find({username:user}).skip((perpage*page)-perpage).limit(perpage);

  cate.exec((err,data)=>{
    if(err) throw err;

    var countdata=category_modal.countDocuments({username:user});
    countdata.exec((err1,count)=>{

      if(err1) throw err1;

      var totalpage=Math.ceil(count/perpage);
      
      if(page>totalpage)
      {
        res.status(404).send("<h1>Not found</h1>");
      }
      else{
      res.render('viewallcategory', { title: 'Password Management System' ,records:data,current:page,pages:totalpage});
      }
    });

    
  });


  




});





























router.post('/viewallcategory',checklogin, function(req, res, next) {
    var id=req.body.id;

    var cate_d=category_modal.findByIdAndUpdate(id,{

      category_name:req.body.txtcategoryname

    });

    cate_d.exec((err,data)=>{
      if(err) throw err;

      res.redirect("/viewallcategory");
    });

});


router.get('/addnewpassword',checklogin, function(req, res, next) {

  var user=localStorage.getItem('username');
    
    var cate=category_modal.find({username:user});

    cate.exec((err,data)=>{
      if(err) throw err;

    

     res.render('addnewpassword', { title: 'Password Management System',records:data,msg:'' });

    });

});

router.post('/addnewpassword',checklogin, function(req, res, next) {


      


  var user=localStorage.getItem('username');


  var cate_name=req.body.category_dropdown;
  var pass_details=req.body.cate_details;

  console.log(pass_details);

  var addpass=new passdetails_modal({

      username:user,
      category_name:cate_name,
      password_details:pass_details


  });

      if(cate_name!=null)
      {
        
        addpass.save((err,data)=>{
          if(err) throw err;

          var cate_name=category_modal.find({username:user});
          cate_name.exec((err1,data1)=>{

            if(err1) throw err1;

            res.render('addnewpassword', { title: 'Password Management System',records:data1,msg:'password details inserted!' });
          });

        });
       

      }
      else{
        var cate_name=category_modal.find({username:user});
        cate_name.exec((err,data)=>{
            if(err) throw err;

        res.render('addnewpassword', { title: 'Password Management System',records:data,msg:'Category Not selected!' });    
        });
      }


     


});


router.get('/delete_password/:id',checklogin,function(req,res,next){
 var id=req.params.id;

 var del_pass=pass_details_modal.findByIdAndRemove(id);
 del_pass.exec((err,data)=>{
   if(err) throw err;
   res.redirect('/viewallpassword');
 });



});

router.get('/viewallpassword',checklogin, function(req, res, next) {


    var parpage=5;
    var page=1;
  var user=localStorage.getItem('username');

  var cate_detail=passdetails_modal.find({username:user}).skip((parpage*page)-parpage).limit(parpage);

  cate_detail.exec((err,data)=>{
    
    if(err) throw err;
       var passcount=passdetails_modal.countDocuments({username:user});
       passcount.exec((err1,count)=>{
        var totalpage=Math.ceil(count/parpage);
        res.render('viewallpassword', { title: 'Password Management System',records:data,current:page,pages:totalpage });
       });
    

  });

  


});


router.get('/viewallpassword/:page',checklogin, function(req, res, next) {


  var parpage=5;
  var page=req.params.page;
var user=localStorage.getItem('username');

var cate_detail=passdetails_modal.find({username:user}).skip((parpage*page)-parpage).limit(parpage);

cate_detail.exec((err,data)=>{
  
  if(err) throw err;
     var passcount=passdetails_modal.countDocuments({username:user});
     passcount.exec((err1,count)=>{
      var totalpage=Math.ceil(count/parpage);
      res.render('viewallpassword', { title: 'Password Management System',records:data,current:page,pages:totalpage });
     });
  

});




});




















router.post("/viewallpassword",checklogin,function(req,res,next){

  var id=req.body.id;

  var up_pass=pass_details_modal.findByIdAndUpdate(id,{

    category_name:req.body.cate_ddl,
    password_details:req.body.txtpassdetail    

  });

  up_pass.exec((err,data)=>{
    if(err) throw err;

    res.redirect("/viewallpassword");
  });

});


router.get('/edit_category/:id', checklogin,function(req, res, next) {

  var id=req.params.id;
  
  var cate_d=category_modal.findById(id);

  cate_d.exec((err,data)=>{

    if(err) throw err;

    res.render('edit_category', { title: 'Password Management System',records:data });


  });

  



});

router.get('/edit_password/:id',checklogin, function(req, res, next) {
  var id_pass=req.params.id;
  var user=localStorage.getItem('username');
var pass_d=passdetails_modal.findById(id_pass);


  var c_name=category_modal.find({username:user});
  c_name.exec((err,data)=>{
    if(err) throw err;
    pass_d.exec((err1,data1)=>{
      if(err1) throw err1;
      
      res.render('edit_password', { title: 'Password Management System',records:data,pass_detail:data1 });
    });
    
  });

  
});

router.get('/delete/:id',checklogin, function(req, res, next) {
  
  var id=req.params.id;

  var cate = category_modal.findByIdAndRemove(id);

  cate.exec((err)=>{
    if(err) throw err;

    res.redirect("/viewallcategory");
  });


});






//============logout=============

router.post('/logout', function(req, res, next) {
  localStorage.removeItem('usertoken');
  localStorage.removeItem('username');
  res.redirect('/');
});

//================login-logout middlewear============================


function checklogin(req,res,next){

var mytoken=localStorage.getItem('usertoken');
try{
          jwt.verify(mytoken,'logintoken');
}catch(err){
  res.redirect('/');
}
    next();
}















module.exports = router;
