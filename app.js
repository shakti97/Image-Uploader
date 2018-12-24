const express =require('express');
const path= require('path');
const ejs=require('ejs');
const multer=require('multer');
const dotenv=require('dotenv');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

dotenv.config();

const storageCloud = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "upload",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
    });

const parser = multer({ storage: storageCloud });

const storage = multer.diskStorage({
    destination  : './public/uploads/',
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
    });

const upload =multer({
    storage : storage,
    limits : {fileSize : 100000},
    fileFilter : function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('Image');

function checkFileType(file,cb){
    const filetypes=/jpeg|jpg|png|gif/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype= filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true)
    }else{
        cb('Error : Image Only')
    }
}

const app=express();
app.set('view engine','ejs');

app.use(express.static('./public'));
app.get('/',(req,res)=>res.render('index'));

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
            msg : err
            })
        } if(req.file==undefined){
            res.render('index',{
                msg : 'No file attached'
            })
        }else{
                console.log(req.file);
                res.render('index',{
                    msg : 'File uploaded Successfully',
                    file : `uploads/${req.file.filename}`
                })
        }

    })
})
app.post('/api/images', parser.single("image"), (req, res) => {
    console.log(req.file) // to see what is returned to you

    //Code to save the Image in the Database
    // const image = {};
    // image.url = req.file.url;
    // image.id = req.file.public_id;
    // Image.create(image) 
    //   .then(newImage => res.json(newImage))
    //   .catch(err => console.log(err));
  });
const port=process.env.PORT || 8000
app.listen(port,()=>{
    console.log('Server Started');
})