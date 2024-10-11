const path = require('path');
const multer = require('multer');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    

    cb(null, path.join(__dirname, '../public/uploads/images/languagesFlag/')); // Path to store images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// File type check function
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only Jpeg,Jpg & Png are allowed!');
  }
}

// Init multer upload with validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: function (req, file, cb) {
    
    checkFileType(file, cb);
  }
}).single('urlFlag'); 

const uploadImage = (req, res, next) => {

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err, status: 'fail' });
    }
    if (!req.file && req.method !== 'PATCH') { // file is not obligatory for updating Method
      return res.status(400).json({ message: 'Flag is required', status: 'fail' });
    }
    next(); 
  });
};

module.exports = uploadImage;
