
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure upload folder exists
const uploadPath = 'uploads/';
if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // destination folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1234.png
    },
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if(allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only .png, .jpg and .jpeg allowed'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;