const Role = require('../models/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({}).populate('permissions');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private/Admin
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a role
// @route   POST /api/roles
// @access  Private/Admin
const createRole = async (req, res) => {
  const { name, description, permissions } = req.body;

  try {
    const role = new Role({
      name,
      description,
      permissions,
    });

    const createdRole = await role.save();
    res.status(201).json(createdRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private/Admin
const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (role) {
      role.name = req.body.name || role.name;
      role.description = req.body.description || role.description;
      role.permissions = req.body.permissions || role.permissions;

      const updatedRole = await role.save();
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (role) {
      await role.remove();
      res.json({ message: 'Role removed' });
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};