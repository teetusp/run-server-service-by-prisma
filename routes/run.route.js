//จัดการเรื่องเส้นทางเพื่อกำหนด endpoint สำหรับ fontend
//ในการเรียกใช้ controller เพื่อการทำงาน CRUD กับฐานข้อมูล และอัปโหลดไฟล์

//require package ที่ต้องใช้ในการกำหนดเส้นทาง (route)
const express = require('express');

//require controller เพื่อจะใช้งาน
const runController = require('./../controllers/run.controller.js');
const { route } = require('./runner.route.js');

//สร้าง router จาก express เพื่อจัดการเส้นทาง
const router = express.Router();

//กำหนดเส้นทางใ และการเรียกใช้ controller
//เพิ่มข้อมูล
router.post('/', runController.uploadRun, runController.createRun);
//ค้นหา ตรวจสอบ ดึง ดู
router.get('/:runnerId', runController.getAllRunOfRunner);
router.get('/only/:runId', runController.getOnlyRunOfRunner);
//ลบข้อมูล
router.delete('/:runId', runController.deleteRunOfRunner);
//แก้ไขข้อมูล
router.put('/:runId', runController.uploadRun, runController.updateRunOfRunner);

module.exports = router;