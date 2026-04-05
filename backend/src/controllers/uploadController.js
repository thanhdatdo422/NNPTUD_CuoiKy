const Upload = require('../models/Upload');
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// @desc    Upload image
// @route   POST /api/uploads
// @access  Private
const uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: 'No file selected' });
      } else {
        const upload = new Upload({
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
          url: `/uploads/${req.file.filename}`,
          uploadedBy: req.user._id,
        });

        const createdUpload = await upload.save();
        res.status(201).json({
          message: 'File uploaded!',
          file: `/uploads/${req.file.filename}`,
          upload: createdUpload,
        });
      }
    }
  });
};

// @desc    Get all uploads
// @route   GET /api/uploads
// @access  Private/Admin
const getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({}).populate('uploadedBy');
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete upload
// @route   DELETE /api/uploads/:id
// @access  Private/Admin
const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (upload) {
      // Remove file from filesystem
      const fs = require('fs');
      fs.unlinkSync(upload.path);

      await upload.remove();
      res.json({ message: 'Upload removed' });
    } else {
      res.status(404).json({ message: 'Upload not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadImage,
  getUploads,
  deleteUpload,
};