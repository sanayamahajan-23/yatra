const express = require('express');
const router = express.Router();
const controller = require('../controller/registration')
const os = require('os');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: function (req, file, cb) {
        let name = Date.now() + "-" + file.originalname;
        cb(null, name);
    }
});

let upload = multer({
    storage: multerStorage
});

router.post("/submit", upload.any(), async (req, res) => {
    console.log('Received a request from the frontend at /submit endpoint');
    try {
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);

        let files = req.files || [];
        let aadharFront, aadharBack;

        files.forEach(file => {
            if (file.fieldname === 'aadharFront' && !aadharFront) {
                aadharFront = file;
            } else if (file.fieldname === 'aadharBack' && !aadharBack) {
                aadharBack = file;
            }
        });

        if (!aadharFront || !aadharBack) {
            throw new Error('please submit both front and back of aadhaar');
        }

        const body = req.body;
        const data = await controller.submitRegistration(body, [aadharFront, aadharBack]);
        console.log('Registration data:', data);
        return res.send({ status: true, data: data });
    } catch (error) {
        console.error('Error occurred:', error.stack);
        return res.send({ status: false, message: error.message || error });
    }
});

router.post("/fetch", async (req, res) => {
    console.log('Received a request from the frontend at /fetch endpoint');
    try {
        const registration_number = req.body.registration_number;
        console.log('Request body:', req.body);

        const data = await controller.fetchRegistration(registration_number);

        console.log('Fetched registration data:', data);

        return res.send({ status: true, data: data });
    } catch (error) {
        console.error('Error occurred:', error.stack);
        return res.send({ status: false, message: error.message || error });
    }
});

module.exports = router;
