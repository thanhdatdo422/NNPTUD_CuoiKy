const express = require('express');
const {
  uploadImage,
  getUploads,
  deleteUpload,
} = require('../controllers/uploadController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getUploads).post(protect, uploadImage);
router.route('/:id').delete(protect, admin, deleteUpload);

module.exports = router;