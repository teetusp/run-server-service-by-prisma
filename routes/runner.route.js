//จัดการเรื่องเส้นทางเพื่อกำหนด endpoint สำหรับ fontend
//ในการเรียกใช้ controller เพื่อการทำงาน CRUD กับฐานข้อมูล และอัปโหลดไฟล์

//require package ที่ต้องใช้ในการกำหนดเส้นทาง (route)
const express = require('express');

//require controller เพื่อจะใช้งาน
const runnerController = require('./../controllers/runner.controller.js');

//สร้าง router จาก express เพื่อจัดการเส้นทาง
const router = express.Router();

//กำหนดเส้นทางใ และการเรียกใช้ controller
//เพิ่มข้อมูล
router.post('/', runnerController.uploadRunner, runnerController.createRunner);

//แก้ไขข้อมูล

//ตรวจสอบชื่อผู้ใช้ และรหัสผ่าน
router.get('/:runnerUsername/:runnerPassword', runnerController.checkLoginRunner);

module.exports = router;