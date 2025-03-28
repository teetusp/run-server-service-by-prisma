const express = require('express');
const cors = require('cors');
const runnerRoute = require('./routes/runner.route.js');
const runRoute = require('./routes/run.route.js');

require('dotenv').config();

const app = express(); //สร้าง web server

const port = process.env.PORT || 5555; //เรียกใช้ค่า PORT จาก .env

//ใช้ middleware ในการจัดการ
//การเรียกใช้งานข้าม domain
app.use(cors());
//ข้อมูล JSON จาก client/user
app.use(express.json());
//เส้นทาง
app.use('/runner', runnerRoute);
app.use('/run', runRoute);
//เข้าถึงไฟล์รูป
app.use('/images/runner', express.static('images/runner'));
app.use('/images/run', express.static('images/run'));

//เขียนคำสั่ง Test 
app.get('/', (req, res) => {
    res.json({
        message: `Welcome to backend run server service`
    })
})

//คำสั่งที่เปิดใช้ server เพื่อให้ client/user เข้าถึง resource ใน server
app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);
})