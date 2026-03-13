const router = require('express').Router();
const { getAllPosts, getPost, createPost, updatePost, deletePost, getMyPosts } = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');

router.get(   '/',      getAllPosts);
router.get(   '/my',    authenticate, getMyPosts);
router.get(   '/:slug', getPost);
router.post(  '/',      authenticate, createPost);
router.patch( '/:id',   authenticate, updatePost);
router.delete('/:id',   authenticate, deletePost);

module.exports = router;