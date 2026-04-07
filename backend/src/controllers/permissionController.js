const Permission = require('../models/Permission');

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private/Admin
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single permission
// @route   GET /api/permissions/:id
// @access  Private/Admin
const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (permission) {
      res.json(permission);
    } else {
      res.status(404).json({ message: 'Permission not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a permission
// @route   POST /api/permissions
// @access  Private/Admin
const createPermission = async (req, res) => {
  const { name, description, resource, action } = req.body;

  try {
    const permission = new Permission({
      name,
      description,
      resource,
      action,
    });

    const createdPermission = await permission.save();
    res.status(201).json(createdPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a permission
// @route   PUT /api/permissions/:id
// @access  Private/Admin
const updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (permission) {
      permission.name = req.body.name || permission.name;
      permission.description = req.body.description || permission.description;
      permission.resource = req.body.resource || permission.resource;
      permission.action = req.body.action || permission.action;

      const updatedPermission = await permission.save();
      res.json(updatedPermission);
    } else {
      res.status(404).json({ message: 'Permission not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a permission
// @route   DELETE /api/permissions/:id
// @access  Private/Admin
const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (permission) {
      await permission.remove();
      res.json({ message: 'Permission removed' });
    } else {
      res.status(404).json({ message: 'Permission not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
};