//จัดการเรื่องอัปโหลดไฟล์ โดย multer
//จัดการเรื่อง การทำงาน CRUD กับฐานข้อมูล โดย prisma

//require package ที่ต้องใช้ในการ Upload ไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//require package ที่ต้องใช้ในการทำงานกับฐานข้อมูล
const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/run');
    },
    filename: (req, file, cb) => {
        cb(null, 'run_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadRun = multer({
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
}).single('runImage');

//สร้างฟังก์ชั่น Create/Insert เพื่อเพิ่มข้อมูลลงตารางในฐานข้อมูล
exports.createRun = async (req, res) => {
    try{
        //เอาข้อมูลที่ส่งมาจาก client/user เพื่มลงตารางในฐานข้อมูล
        const result = await prisma.run_tb.create({ // create คือ การเพิ่มข้อมูล
            data: {
                dateRun: req.body.dateRun,
                distanceRun: parseFloat(req.body.distanceRun),
                placeRun: req.body.placeRun,
                runImage: req.file ? req.file.path.replace("images\\run\\", "") : "",
                runnerId: parseInt(req.body.runnerId)
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

//สร้างฟังก์ชั่นดึงข้อมูลการวิ่งทั้งหมดของนักวิ่งหนึ่งๆ
exports.getAllRunOfRunner = async (req, res) => {
    try{
        const result = await prisma.run_tb.findMany({ 
            where: {
                runnerId: parseInt(req.params.runnerId)
            }
        });
        res.status(200).json({
            message: 'search data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//สร้างฟังก์ชั่นลบข้อมูลการวิ่ง
exports.deleteRunOfRunner = async (req, res) => {
    try{
        const result = await prisma.run_tb.delete({ 
            where: {
                runId: parseInt(req.params.runId)
            }
        });
        res.status(200).json({
            message: 'delete data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//สร้างฟังก์ชั่นดึงข้อมูลการวิ่งหนึ่งๆ ของนักวิ่ง
exports.getOnlyRunOfRunner = async (req, res) => {
    try{
        const result = await prisma.run_tb.findFirst({ 
            where: {
                runId: parseInt(req.params.runId)
            }
        });
        res.status(200).json({
            message: 'select data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//สร้างฟังก์ชั่นแก้ไขข้อมูลการวิ่ง
exports.updateRunOfRunner = async (req, res) => {
    try{
        let result;
        if(req.file){
            //แก้ไขแบบแก้ไขรูป
            result = await prisma.run_tb.update({
                where: {
                    runId: parseInt(req.params.runId)
                }, 
                data: {
                    dateRun: req.body.dateRun,
                    distanceRun: parseFloat(req.body.distanceRun),
                    placeRun: req.body.placeRun,
                    runImage: req.file.path.replace("images\\run\\", ""),
                    runnerId: parseInt(req.body.runnerId)
                }
            });
        }else{
            //แก้ไขแบบไม่แก้ไขรูป
            result = await prisma.run_tb.update({
                where: {
                    runId: parseInt(req.params.runId)
                }, 
                data: {
                    dateRun: req.body.dateRun,
                    distanceRun: parseFloat(req.body.distanceRun),
                    placeRun: req.body.placeRun,
                    runnerId: parseInt(req.body.runnerId)
                }
            });
        }
        //ส่งผลการทำงานกลับไปยัง client/user
        res.status(201).json({
            message: 'Update data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}