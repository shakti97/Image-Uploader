const express =require('express');
const path= require('path');
const ejs=require('ejs');
const multer=require('multer');


const storage = multer.diskStorage({
    destination  : './public/uploads/',
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
})

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
const port=process.env.PORT || 8000
app.listen(port,()=>{
    console.log('Server Started');
})