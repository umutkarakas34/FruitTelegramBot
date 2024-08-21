const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Yükleme dizini
const uploadDir = path.join(__dirname, '..', 'uploads', 'tasks');

// Dizin yoksa oluştur
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Resimlerin kaydedileceği dizin
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz dosya ismi
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
