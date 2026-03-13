const router = require('express').Router({ mergeParams: true });
const { getComments, addComment, updateComment, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

router.get(   '/',    getComments);
router.post(  '/',    authenticate, addComment);
router.patch( '/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;