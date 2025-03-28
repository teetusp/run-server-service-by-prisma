//จัดการเรื่องอัปโหลดไฟล์ โดย multer
//จัดการเรื่อง การทำงาน CRUD กับฐานข้อมูล โดย prisma

//require package ที่ต้องใช้ในการ Upload ไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//require package ที่ต้องใช้ในการทำงานกับฐานข้อมูล
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/runner');
    },
    filename: (req, file, cb) => {
        cb(null, 'runner_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadRunner = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb('Give proper files formate to upload');
    }
}).single('runnerImage');

//สร้างฟังก์ชั่น Create/Insert เพื่อเพิ่มข้อมูลลงตารางในฐานข้อมูล
exports.createRunner = async (req, res) => {
    try{
        //เอาข้อมูลที่ส่งมาจาก client/user เพื่มลงตารางในฐานข้อมูล
        const result = await prisma.runner_tb.create({ // create คือ การเพิ่มข้อมูล
            data: {
                runnerName: req.body.runnerName,
                runnerUsername: req.body.runnerUsername,
                runnerPassword: req.body.runnerPassword,
                runnerImage: req.file ? req.file.path.replace("images\\runner\\", "") : "",
            }
        });

        //ส่งผลการทำงานกลับไปยัง client/user
        res.status(201).json({
            message: 'Insert data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}
    

exports.checkLoginRunner = async (req, res) => {
    try{
        const result = await prisma.runner_tb.findFirst({ 
          where: {
            runnerUsername: req.params.runnerUsername,
            runnerPassword: req.params.runnerPassword
          }
        });
        if(result){
            res.status(200).json({
                message: 'username and password is correct',
                data: result
            });
        }
        else{
            res.status(404).json({
                message: 'username and password is incorrect',
                data: result
            });
        }
       
    } catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

