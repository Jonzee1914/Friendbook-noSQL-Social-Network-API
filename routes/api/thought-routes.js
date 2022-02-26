const router = require('express').Router();

// Import from thoughts-controller)
const { 
    getAllThoughts, 
    getThoughtsById, 
    createThoughts, 
    updateThoughts,
    deleteThoughts,
    addReaction,
    deleteReaction

} = require('../../controllers/thoughts-controller');

// routes for /api/thoughts
router.route('/').get(getAllThoughts);

// routes for /api/thoughts/:id
router.route('/:id').get(getThoughtsById).put(updateThoughts).delete(deleteThoughts); 

// routes for /api/thoughts/:userId
router.route('/:userId').post(createThoughts);

// routes for /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// routes for /api/thoughts/:thoughtId/reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;