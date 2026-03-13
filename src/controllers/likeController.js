const pool = require('../config/database');

// POST /api/posts/:postId/like
const togglePostLike = async (req, res) => {
  try {
    const postId = +req.params.postId;
    const post = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (!post.rows.length) return res.status(404).json({ error: 'Post not found' });

    const existing = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [req.user.id, postId]
    );

    if (existing.rows.length) {
      await pool.query('DELETE FROM likes WHERE id = $1', [existing.rows[0].id]);
      return res.json({ liked: false, message: 'Like removed' });
    }

    await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [req.user.id, postId]);
    res.status(201).json({ liked: true, message: 'Post liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/comments/:commentId/like
const toggleCommentLike = async (req, res) => {
  try {
    const commentId = +req.params.commentId;
    const comment = await pool.query('SELECT id FROM comments WHERE id = $1', [commentId]);
    if (!comment.rows.length) return res.status(404).json({ error: 'Comment not found' });

    const existing = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2',
      [req.user.id, commentId]
    );

    if (existing.rows.length) {
      await pool.query('DELETE FROM likes WHERE id = $1', [existing.rows[0].id]);
      return res.json({ liked: false, message: 'Like removed' });
    }

    await pool.query('INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)', [req.user.id, commentId]);
    res.status(201).json({ liked: true, message: 'Comment liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/posts/:postId/likes
const getPostLikes = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.avatar_url, l.created_at AS liked_at
       FROM likes l JOIN users u ON u.id = l.user_id
       WHERE l.post_id = $1 ORDER BY l.created_at DESC`,
      [req.params.postId]
    );
    res.json({ likes: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { togglePostLike, toggleCommentLike, getPostLikes };