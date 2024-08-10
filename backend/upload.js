const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/tasks/'); // Resimlerin kaydedileceği dizin
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz dosya ismi
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
