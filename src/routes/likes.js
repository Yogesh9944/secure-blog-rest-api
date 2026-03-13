const router = require('express').Router();
const { togglePostLike, toggleCommentLike, getPostLikes } = require('../controllers/likeController');
const { authenticate } = require('../middleware/auth');

router.post('/posts/:postId/like',       authenticate, togglePostLike);
router.get( '/posts/:postId/likes',      getPostLikes);
router.post('/comments/:commentId/like', authenticate, toggleCommentLike);

module.exports = router;