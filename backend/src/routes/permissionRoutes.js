const express = require('express');
const {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} = require('../controllers/permissionController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getPermissions).post(protect, admin, createPermission);
router
  .route('/:id')
  .get(protect, admin, getPermissionById)
  .put(protect, admin, updatePermission)
  .delete(protect, admin, deletePermission);

module.exports = router;