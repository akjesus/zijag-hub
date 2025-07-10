const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({                                                                                      
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
        cb(null, true);
    } else {
        cb(new Error("Only CSV files are allowed!"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
