const express = require('express');
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getRoles).post(protect, admin, createRole);
router
  .route('/:id')
  .get(protect, admin, getRoleById)
  .put(protect, admin, updateRole)
  .delete(protect, admin, deleteRole);

module.exports = router;