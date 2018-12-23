const express =require('express');
const path= require('multer');
const ejs=require('ejs');
const multer=require('multer');

const app=express();
app.set('view engine','ejs');
app.get('/',(req,res)=>res.render('index'));
const port=process.env.PORT || 8000
app.listen(port,()=>{
    console.log('Server Started');
})