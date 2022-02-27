const router = require('express').Router();

// Import from controllers
const {
    getAllUsers,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers,
    addFriend,
    deleteFriend
  } = require('../../controllers/users-controller');

// routes for /api/users
router.route('/').get(getAllUsers).post(createUsers);

// routes for /api/users/:id
router.route('/:id').get(getUsersById).put(updateUsers).delete(deleteUsers);

// routes for /api/users/:userId/friends/:friendId
router.route('/:id/friends/:friendId').post(addFriend).delete(deleteFriend)

module.exports = router; 